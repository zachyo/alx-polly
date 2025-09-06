"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Creates a new poll with a question and options.
 * @param {FormData} formData - The form data containing the poll question and options.
 * @returns {Promise<{ error: string | null }>} An object with an error message if creation fails, otherwise null.
 */
export async function createPoll(formData: FormData) {
  const supabase = await createClient();

  const question = formData.get("question") as string;
  const options = formData.getAll("options").filter(Boolean) as string[];

  if (!question || options.length < 2) {
    return { error: "Please provide a question and at least two options." };
  }

  // Get user from session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    return { error: userError.message };
  }
  if (!user) {
    return { error: "You must be logged in to create a poll." };
  }

  const { error } = await supabase.from("polls").insert([
    {
      user_id: user.id,
      question,
      options,
    },
  ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/polls");
  return { error: null };
}

/**
 * Fetches all polls created by the currently authenticated user.
 * @returns {Promise<{ polls: any[], error: string | null }>} An object containing the user's polls or an error message.
 */
export async function getUserPolls() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { polls: [], error: "Not authenticated" };

  const { data, error } = await supabase
    .from("polls")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { polls: [], error: error.message };
  return { polls: data ?? [], error: null };
}

/**
 * Retrieves a specific poll by its unique ID.
 * @param {string} id - The ID of the poll to retrieve.
 * @returns {Promise<{ poll: any | null, error: string | null }>} An object containing the poll data or an error message.
 */
export async function getPollById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("polls")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { poll: null, error: error.message };
  return { poll: data, error: null };
}

/**
 * Records a user's vote on a poll.
 * @param {string} pollId - The ID of the poll being voted on.
 * @param {number} optionIndex - The index of the selected option.
 * @returns {Promise<{ error: string | null }>} An object with an error message if voting fails, otherwise null.
 */
export async function submitVote(pollId: string, optionIndex: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Optionally require login to vote
  if (!user) return { error: 'You must be logged in to vote.' };

  const { error } = await supabase.from("votes").insert([
    {
      poll_id: pollId,
      user_id: user?.id ?? null,
      option_index: optionIndex,
    },
  ]);

  if (error) return { error: error.message };
  return { error: null };
}

/**
 * Removes a poll from the database.
 * @param {string} id - The ID of the poll to delete.
 * @returns {Promise<{ error: string | null }>} An object with an error message if deletion fails, otherwise null.
 */
export async function deletePoll(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("polls").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/polls");
  return { error: null };
}

/**
 * Modifies an existing poll's question and options.
 * @param {string} pollId - The ID of the poll to update.
 * @param {FormData} formData - The form data containing the updated question and options.
 * @returns {Promise<{ error: string | null }>} An object with an error message if the update fails, otherwise null.
 */
export async function updatePoll(pollId: string, formData: FormData) {
  const supabase = await createClient();

  const question = formData.get("question") as string;
  const options = formData.getAll("options").filter(Boolean) as string[];

  if (!question || options.length < 2) {
    return { error: "Please provide a question and at least two options." };
  }

  // Get user from session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    return { error: userError.message };
  }
  if (!user) {
    return { error: "You must be logged in to update a poll." };
  }

  // Only allow updating polls owned by the user
  const { error } = await supabase
    .from("polls")
    .update({ question, options })
    .eq("id", pollId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
