"use client"

import { useState, useEffect } from "react"
import notesService from "@/lib/NotesService"

export function useNotesService() {
  const [notes, setNotes] = useState([])
  const [currentNote, setCurrentNote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Subscribe to service updates
    const unsubscribeNotes = notesService.onNotesChange(setNotes)
    const unsubscribeCurrentNote = notesService.onCurrentNoteChange(setCurrentNote)
    const unsubscribeLoading = notesService.onLoadingChange(setLoading)
    const unsubscribeError = notesService.onErrorChange(setError)

    // Fetch notes on mount
    notesService.fetchNotes()

    // Cleanup subscriptions
    return () => {
      unsubscribeNotes()
      unsubscribeCurrentNote()
      unsubscribeLoading()
      unsubscribeError()
    }
  }, [])

  const fetchNotes = async () => {
    return await notesService.fetchNotes()
  }

  const fetchNote = async (noteId) => {
    return await notesService.fetchNote(noteId)
  }

  const createNotes = async (documentId, title, topic = "") => {
    return await notesService.createNotes(documentId, title, topic)
  }

  const generateNotes = async (documentId, title, topic = "") => {
    return await notesService.generateNotes(documentId, title, topic)
  }

  const updateNote = async (noteId, updates) => {
    return await notesService.updateNote(noteId, updates)
  }

  const deleteNote = async (noteId) => {
    return await notesService.deleteNote(noteId)
  }

  return {
    notes,
    currentNote,
    loading,
    error,
    fetchNotes,
    fetchNote,
    createNotes,
    generateNotes,
    updateNote,
    deleteNote
  }
}
