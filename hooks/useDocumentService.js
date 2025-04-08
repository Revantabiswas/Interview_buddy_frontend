"use client"

import { useState, useEffect } from "react"
import documentService from "@/lib/DocumentService"

export function useDocumentService() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    // Subscribe to document service updates
    const unsubscribeDocuments = documentService.onDocumentsChange(setDocuments)
    const unsubscribeLoading = documentService.onLoadingChange(setLoading)
    const unsubscribeError = documentService.onErrorChange(setError)
    const unsubscribeUploadProgress = documentService.onUploadProgressChange(setUploadProgress)

    // Fetch documents on mount
    documentService.fetchDocuments()

    // Cleanup subscriptions
    return () => {
      unsubscribeDocuments()
      unsubscribeLoading()
      unsubscribeError()
      unsubscribeUploadProgress()
    }
  }, [])

  const fetchDocuments = async () => {
    return await documentService.fetchDocuments()
  }

  const fetchDocument = async (documentId) => {
    return await documentService.fetchDocument(documentId)
  }

  const uploadDocument = async (file) => {
    return await documentService.uploadDocument(file)
  }

  const deleteDocument = async (documentId) => {
    return await documentService.deleteDocument(documentId)
  }

  const getDocumentText = async (documentId) => {
    return await documentService.getDocumentText(documentId)
  }

  return {
    documents,
    loading,
    error,
    uploadProgress,
    fetchDocuments,
    fetchDocument,
    uploadDocument,
    deleteDocument,
    getDocumentText
  }
}