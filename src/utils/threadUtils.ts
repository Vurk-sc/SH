import { supabase } from '@/lib/supabase'

export const createThread = async (title: string, content: string, isPrivate: boolean, authorId: string) => {
  try {
    const { error } = await supabase
      .from('threads')
      .insert({
        title: title.trim(),
        content: content.trim(),
        is_private: isPrivate,
        author_id: authorId,
      })

    if (error) {
      console.error('Error creating thread:', error)
      throw new Error('Failed to create thread')
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false }
  }
}
