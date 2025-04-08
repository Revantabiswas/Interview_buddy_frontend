"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Clock, FileText, Lightbulb, Trash2, Copy, ThumbsUp, ThumbsDown } from "lucide-react"
import { useDocumentService } from "@/hooks/useDocumentService"
import { useToast } from "@/components/ui/use-toast"
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import chatService from '@/lib/ChatService'

export default function AIChat() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [input, setInput] = useState("")
  const [selectedDocument, setSelectedDocument] = useState(null)
  const messagesEndRef = useRef(null)
  const { toast } = useToast()
  const { documents, loading: isLoadingDocuments, fetchDocuments } = useDocumentService()

  // Subscribe to chat service updates
  useEffect(() => {
    // Subscribe to messages updates
    const unsubscribeMessages = chatService.onMessagesChange(setMessages)
    
    // Subscribe to loading state updates
    const unsubscribeLoading = chatService.onLoadingChange(setIsLoading)
    
    // Subscribe to error updates
    const unsubscribeError = chatService.onErrorChange(setError)

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeMessages()
      unsubscribeLoading()
      unsubscribeError()
    }
  }, [])

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments()
      .catch(error => {
        console.error("Error fetching documents:", error)
        toast({
          title: "Error",
          description: "Failed to load documents",
          variant: "destructive",
        })
      })
  }, [fetchDocuments, toast])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Poll for document updates
  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (documents.some(doc => doc.status === "processing")) {
        fetchDocuments()
      }
    }, 5000)
    
    return () => clearInterval(pollInterval)
  }, [documents, fetchDocuments])

  const clearChat = () => {
    chatService.clearChat()
    setInput("")
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || !selectedDocument) return
    
    try {
      await chatService.sendMessage(selectedDocument.id, input)
      setInput("")
    } catch (err) {
      console.error("Failed to send message:", err)
    }
  }

  const handleSelectDocument = (document) => {
    setSelectedDocument(document)
    // Optionally clear chat when switching documents
    clearChat()
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({
      description: "Copied to clipboard",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Chat Assistant</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Document Context Sidebar */}
        <Card className="lg:col-span-1 h-[calc(100vh-12rem)] flex flex-col">
          <Tabs defaultValue="documents">
            <TabsList className="w-full">
              <TabsTrigger value="documents" className="flex-1">
                Documents
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1">
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="flex-1 overflow-auto p-4">
              <h3 className="font-medium mb-3">Available Documents</h3>
              {isLoadingDocuments ? (
                <div className="text-center py-12">
                  <Clock className="h-6 w-6 mx-auto mb-2 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Loading documents...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">No documents available.</p>
                  <p className="text-sm text-muted-foreground">Upload a document first to chat with it.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div 
                      key={doc.id}
                      className={`flex items-center p-2 rounded-md cursor-pointer ${
                        selectedDocument?.id === doc.id ? 'bg-secondary' : 'hover:bg-secondary/50'
                      }`}
                      onClick={() => handleSelectDocument(doc)}
                    >
                      <FileText className={`h-4 w-4 mr-2 ${
                        doc.type === 'pdf' ? 'text-red-500' : 
                        doc.type === 'docx' ? 'text-blue-500' : 
                        'text-gray-500'
                      }`} />
                      <span className="text-sm truncate">{doc.filename}</span>
                      <span className="ml-auto">
                        {doc.status === "processed" ? (
                          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                            Ready
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="ml-2 animate-pulse">
                            Processing
                          </Badge>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <h3 className="font-medium mb-2">Chat Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <Lightbulb className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                    <span>Ask specific questions about your document's content</span>
                  </li>
                  <li className="flex items-start">
                    <Lightbulb className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                    <span>You can ask for summaries, explanations, or examples</span>
                  </li>
                  <li className="flex items-start">
                    <Lightbulb className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                    <span>The more specific your question, the better the answer</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="history" className="flex-1 overflow-auto p-4">
              <h3 className="font-medium mb-3">Chat History</h3>
              <p className="text-sm text-muted-foreground">Your chat history will appear here.</p>
              {/* Chat history would go here */}
            </TabsContent>
          </Tabs>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-3 h-[calc(100vh-12rem)] flex flex-col">
          <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">InterviewBuddy AI</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedDocument 
                      ? `Chatting with: ${selectedDocument.filename}` 
                      : "Please select a document to start chatting"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={clearChat}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[75%] ${
                        message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <Avatar className="h-8 w-8 mt-0.5">
                        <AvatarFallback>
                          {message.role === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {message.htmlContent ? (
                            <div dangerouslySetInnerHTML={{ __html: message.htmlContent }} />
                          ) : (
                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{message.content}</ReactMarkdown>
                          )}
                          
                          {message.sources && (
                            <div className="mt-2 pt-2 border-t border-t-muted-foreground/20 text-xs text-muted-foreground/60">
                              Source: {message.sources.join(", ")}
                            </div>
                          )}
                        </div>
                        <div
                          className={`flex items-center mt-1 text-xs text-muted-foreground ${
                            message.role === "user" ? "justify-end" : ""
                          }`}
                        >
                          <span>{message.timestamp}</span>
                          {message.role === "assistant" && (
                            <div className="flex space-x-1 ml-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(message.content)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2 max-w-[75%]">
                      <Avatar className="h-8 w-8 mt-0.5">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex space-x-1">
                          <span className="animate-bounce">●</span>
                          <span className="animate-bounce animation-delay-200">●</span>
                          <span className="animate-bounce animation-delay-400">●</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={selectedDocument 
                    ? "Ask a question about this document..." 
                    : "Select a document to start chatting"}
                  className="flex-1"
                  disabled={!selectedDocument || isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!selectedDocument || !input.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

