"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  File,
  FileText,
  FileIcon as FilePdf,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock data for uploaded documents
const mockDocuments = [
  {
    id: 1,
    name: "Data Structures Notes.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadDate: "2023-10-15",
    status: "processed",
    pages: 24,
  },
  {
    id: 2,
    name: "Algorithm Cheat Sheet.docx",
    type: "docx",
    size: "1.1 MB",
    uploadDate: "2023-10-12",
    status: "processed",
    pages: 8,
  },
  {
    id: 3,
    name: "System Design Interview.txt",
    type: "txt",
    size: "0.3 MB",
    uploadDate: "2023-10-10",
    status: "processing",
    pages: 5,
  },
]

export default function DocumentUpload() {
  const [documents, setDocuments] = useState(mockDocuments)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)

          // Add the new document to the list
          const newDoc = {
            id: documents.length + 1,
            name: selectedFile.name,
            type: selectedFile.name.split(".").pop().toLowerCase(),
            size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
            uploadDate: new Date().toISOString().split("T")[0],
            status: "processing",
            pages: Math.floor(Math.random() * 20) + 1,
          }

          setDocuments([newDoc, ...documents])
          setSelectedFile(null)

          // Simulate processing completion after 2 seconds
          setTimeout(() => {
            setDocuments((prev) => prev.map((doc) => (doc.id === newDoc.id ? { ...doc, status: "processed" } : doc)))
          }, 2000)

          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const handleDeleteClick = (doc) => {
    setDocumentToDelete(doc)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (documentToDelete) {
      setDocuments(documents.filter((doc) => doc.id !== documentToDelete.id))
      setDeleteDialogOpen(false)
      setDocumentToDelete(null)
    }
  }

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FilePdf className="h-10 w-10 text-red-500" />
      case "docx":
        return <FileText className="h-10 w-10 text-blue-500" />
      case "txt":
        return <File className="h-10 w-10 text-gray-500" />
      default:
        return <File className="h-10 w-10 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Document Upload</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>Upload your study materials in PDF, DOCX, or TXT format</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => document.getElementById("file-upload").click()}
            >
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-1">
                {selectedFile ? selectedFile.name : "Drag & Drop or Click to Upload"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedFile
                  ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                  : "Supports PDF, DOCX, and TXT files up to 10MB"}
              </p>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
              />
              {selectedFile && !isUploading && (
                <Button onClick={handleUpload} className="w-full">
                  Upload File
                </Button>
              )}
            </div>

            {isUploading && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="progress-animation" />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start space-y-2">
            <h4 className="text-sm font-medium">Tips:</h4>
            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
              <li>Clear, well-formatted documents work best</li>
              <li>Ensure text is selectable in PDFs</li>
              <li>Larger documents may take longer to process</li>
            </ul>
          </CardFooter>
        </Card>

        {/* Documents List */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="processed">Processed</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <Card key={doc.id} className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                      <div className="flex-shrink-0">{getFileIcon(doc.type)}</div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{doc.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">{doc.size}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{doc.pages} pages</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">Uploaded on {doc.uploadDate}</span>
                        </div>
                        <div className="mt-2">
                          {doc.status === "processed" ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                              <CheckCircle className="h-3 w-3 mr-1" /> Processed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="animate-pulse">
                              <Clock className="h-3 w-3 mr-1" /> Processing...
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 md:mt-0">
                        <Button variant="outline" size="icon" disabled={doc.status !== "processed"}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(doc)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <AlertCircle className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">No Documents Found</h3>
                    <p className="text-muted-foreground mb-4">Upload your first document to get started</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="processed">
              <div className="space-y-4">
                {documents.filter((doc) => doc.status === "processed").length > 0 ? (
                  documents
                    .filter((doc) => doc.status === "processed")
                    .map((doc) => (
                      <Card key={doc.id} className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                        <div className="flex-shrink-0">{getFileIcon(doc.type)}</div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{doc.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">{doc.size}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{doc.pages} pages</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">Uploaded on {doc.uploadDate}</span>
                          </div>
                          <div className="mt-2">
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                              <CheckCircle className="h-3 w-3 mr-1" /> Processed
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 md:mt-0">
                          <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(doc)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <AlertCircle className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">No Processed Documents</h3>
                    <p className="text-muted-foreground">Your processed documents will appear here</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="processing">
              <div className="space-y-4">
                {documents.filter((doc) => doc.status === "processing").length > 0 ? (
                  documents
                    .filter((doc) => doc.status === "processing")
                    .map((doc) => (
                      <Card key={doc.id} className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                        <div className="flex-shrink-0">{getFileIcon(doc.type)}</div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{doc.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">{doc.size}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{doc.pages} pages</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">Uploaded on {doc.uploadDate}</span>
                          </div>
                          <div className="mt-2">
                            <Badge variant="outline" className="animate-pulse">
                              <Clock className="h-3 w-3 mr-1" /> Processing...
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 md:mt-0">
                          <Button variant="outline" size="icon" disabled>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(doc)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <CheckCircle className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">No Processing Documents</h3>
                    <p className="text-muted-foreground">All your documents have been processed</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{documentToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

