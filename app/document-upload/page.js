"use client"

import { useState, useEffect } from "react"
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
import { useDocumentService } from "@/hooks/useDocumentService"
import { useToast } from "@/components/ui/use-toast"

export default function DocumentUpload() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const { toast } = useToast()
  
  const {
    documents,
    loading: isLoading,
    error,
    uploadProgress,
    uploadDocument,
    fetchDocuments,
    deleteDocument
  } = useDocumentService()

  // Fetch documents on component mount
  useEffect(() => {
    console.log("Fetching documents...");
    fetchDocuments()
      .then(data => {
        console.log("Documents fetched successfully:", data);
      })
      .catch(err => {
        console.error("Failed to fetch documents:", err);
        toast({
          title: "Error",
          description: "Failed to load documents",
          variant: "destructive"
        });
      });
  }, [])

  // Show toast when error occurs
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      })
    }
  }, [error])

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      setUploadSuccess(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    
    try {
      await uploadDocument(selectedFile)
      setSelectedFile(null)
      setUploadSuccess(true)
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      })
    } catch (err) {
      console.error("Upload failed:", err)
      // Error will be handled by the useEffect above
    }
  }

  const handleDeleteClick = (doc) => {
    setDocumentToDelete(doc)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!documentToDelete) return
    
    try {
      await deleteDocument(documentToDelete.id)
      setDeleteDialogOpen(false)
      setDocumentToDelete(null)
      toast({
        title: "Success",
        description: "Document deleted successfully",
      })
    } catch (err) {
      console.error("Delete failed:", err)
      // Error will be handled by the useEffect above
    }
  }

  const getFileIcon = (type) => {
    // Get file type from filename if type is not directly provided
    if (!type && typeof documentToDelete?.filename === 'string') {
      const extension = documentToDelete.filename.split('.').pop().toLowerCase();
      type = extension;
    }
    
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

  // Determine document status (backend might not provide this)
  const getDocumentStatus = (doc) => {
    // If status is explicitly set, use it
    if (doc.status) return doc.status;
    
    // Infer status based on other properties
    // A document is considered processed when it has pages or text data
    return (doc.pages && doc.pages > 0) ? "processed" : "processing";
  }

  const formatFileSize = (sizeInBytes) => {
    if (!sizeInBytes) return "Unknown size"
    const sizeInMB = sizeInBytes / (1024 * 1024)
    return `${sizeInMB.toFixed(1)} MB`
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
                disabled={isLoading}
              />
              {selectedFile && !isLoading && (
                <Button onClick={handleUpload} className="w-full" disabled={isLoading}>
                  Upload File
                </Button>
              )}
            </div>

            {isLoading && uploadProgress > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="progress-animation" />
              </div>
            )}
            
            {uploadSuccess && (
              <div className="mt-4 p-2 bg-green-50 text-green-700 rounded-md flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Document uploaded successfully!</span>
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
                {isLoading && documents.length === 0 ? (
                  <div className="text-center py-12 border rounded-lg">
                    <Clock className="h-10 w-10 mx-auto mb-4 text-muted-foreground animate-spin" />
                    <h3 className="text-lg font-medium">Loading documents...</h3>
                  </div>
                ) : documents.length > 0 ? (
                  documents.map((doc) => (
                    <Card key={doc.id} className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(doc.type || (doc.filename?.split('.').pop().toLowerCase()))}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{doc.name || doc.filename}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">{formatFileSize(doc.size)}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{doc.pages || "?"} pages</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">
                            Uploaded on {new Date(doc.upload_time || doc.upload_date || doc.uploadDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-2">
                          {getDocumentStatus(doc) === "processed" ? (
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
                        <Button variant="outline" size="icon" disabled={getDocumentStatus(doc) !== "processed"}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(doc)}
                          disabled={isLoading}
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
                {documents.filter((doc) => getDocumentStatus(doc) === "processed").length > 0 ? (
                  documents
                    .filter((doc) => getDocumentStatus(doc) === "processed")
                    .map((doc) => (
                      <Card key={doc.id} className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                        <div className="flex-shrink-0">{getFileIcon(doc.type)}</div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{doc.name || doc.filename}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">{formatFileSize(doc.size)}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{doc.pages || "?"} pages</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">
                              Uploaded on {new Date(doc.upload_time || doc.upload_date || doc.uploadDate).toLocaleDateString()}
                            </span>
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
                {documents.filter((doc) => getDocumentStatus(doc) === "processing").length > 0 ? (
                  documents
                    .filter((doc) => getDocumentStatus(doc) === "processing")
                    .map((doc) => (
                      <Card key={doc.id} className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                        <div className="flex-shrink-0">{getFileIcon(doc.type)}</div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{doc.name || doc.filename}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">{formatFileSize(doc.size)}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{doc.pages || "?"} pages</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">
                              Uploaded on {new Date(doc.upload_time || doc.upload_date || doc.uploadDate).toLocaleDateString()}
                            </span>
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
              Are you sure you want to delete "{documentToDelete?.name || documentToDelete?.filename}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}