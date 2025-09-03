"use client"

import { useState } from "react"
import { Search, Filter, ArrowUpDown, CheckCircle, XCircle, MessageSquare, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Mock disputes data
const mockDisputes = [
  {
    id: "DSP-1001",
    title: "Item not as described",
    buyer: {
      id: "1",
      name: "John Doe",
      avatar: "J",
      email: "john.doe@minsu.edu.ph",
    },
    seller: {
      id: "2",
      name: "Jane Smith",
      avatar: "J",
      email: "jane.smith@minsu.edu.ph",
    },
    product: {
      id: "P-1001",
      name: "MacBook Pro 2024",
      price: "₱45,000",
    },
    status: "open",
    priority: "high",
    created: "2023-03-21T10:15:00",
    updated: "2023-03-21T14:30:00",
    description:
      "The laptop I received has significant scratches and dents that were not disclosed in the listing. The seller claimed it was in 'like new' condition.",
    messages: [
      {
        id: "MSG-1",
        user: {
          id: "1",
          name: "John Doe",
          avatar: "J",
          role: "buyer",
        },
        content:
          "I received the laptop today and it has several scratches and dents that weren't mentioned in the listing.",
        timestamp: "2023-03-21T10:15:00",
      },
      {
        id: "MSG-2",
        user: {
          id: "2",
          name: "Jane Smith",
          avatar: "J",
          role: "seller",
        },
        content:
          "I'm sorry to hear that. The scratches must have happened during shipping. I can offer a partial refund of ₱5,000.",
        timestamp: "2023-03-21T11:30:00",
      },
      {
        id: "MSG-3",
        user: {
          id: "1",
          name: "John Doe",
          avatar: "J",
          role: "buyer",
        },
        content: "That's not acceptable. The scratches look old and not from shipping damage. I'd like a full refund.",
        timestamp: "2023-03-21T12:45:00",
      },
    ],
  },
  {
    id: "DSP-1002",
    title: "Item never received",
    buyer: {
      id: "3",
      name: "Alex Johnson",
      avatar: "A",
      email: "alex.johnson@minsu.edu.ph",
    },
    seller: {
      id: "4",
      name: "Maria Santos",
      avatar: "M",
      email: "santos.maria@minsu.edu.ph",
    },
    product: {
      id: "P-1002",
      name: "Calculus Textbook",
      price: "₱1,200",
    },
    status: "investigating",
    priority: "medium",
    created: "2023-03-20T09:30:00",
    updated: "2023-03-21T11:15:00",
    description:
      "I paid for the textbook over a week ago but haven't received it. The seller claims it was shipped but can't provide tracking information.",
    messages: [
      {
        id: "MSG-1",
        user: {
          id: "3",
          name: "Alex Johnson",
          avatar: "A",
          role: "buyer",
        },
        content: "It's been a week since I paid for the textbook but I haven't received it yet.",
        timestamp: "2023-03-20T09:30:00",
      },
      {
        id: "MSG-2",
        user: {
          id: "4",
          name: "Maria Santos",
          avatar: "M",
          role: "seller",
        },
        content: "I shipped it three days ago. It should arrive soon.",
        timestamp: "2023-03-20T10:45:00",
      },
      {
        id: "MSG-3",
        user: {
          id: "3",
          name: "Alex Johnson",
          avatar: "A",
          role: "buyer",
        },
        content: "Can you provide a tracking number?",
        timestamp: "2023-03-20T11:30:00",
      },
      {
        id: "MSG-4",
        user: {
          id: "4",
          name: "Maria Santos",
          avatar: "M",
          role: "seller",
        },
        content: "I used a local courier service that doesn't provide tracking. I'll check with them.",
        timestamp: "2023-03-20T14:15:00",
      },
    ],
  },
  {
    id: "DSP-1003",
    title: "Refund not processed",
    buyer: {
      id: "5",
      name: "David Lee",
      avatar: "D",
      email: "lee.david@minsu.edu.ph",
    },
    seller: {
      id: "1",
      name: "John Doe",
      avatar: "J",
      email: "john.doe@minsu.edu.ph",
    },
    product: {
      id: "P-1003",
      name: "Scientific Calculator",
      price: "₱950",
    },
    status: "resolved",
    priority: "low",
    created: "2023-03-18T14:20:00",
    updated: "2023-03-20T09:45:00",
    description:
      "The seller agreed to a refund after I returned the calculator, but it's been 5 days and the refund hasn't been processed.",
    messages: [
      {
        id: "MSG-1",
        user: {
          id: "5",
          name: "David Lee",
          avatar: "D",
          role: "buyer",
        },
        content: "I returned the calculator as agreed, but haven't received my refund yet.",
        timestamp: "2023-03-18T14:20:00",
      },
      {
        id: "MSG-2",
        user: {
          id: "1",
          name: "John Doe",
          avatar: "J",
          role: "seller",
        },
        content: "I'll process the refund as soon as I receive the calculator.",
        timestamp: "2023-03-18T15:30:00",
      },
      {
        id: "MSG-3",
        user: {
          id: "5",
          name: "David Lee",
          avatar: "D",
          role: "buyer",
        },
        content: "The tracking shows it was delivered 3 days ago. Please process my refund.",
        timestamp: "2023-03-19T10:15:00",
      },
      {
        id: "MSG-4",
        user: {
          id: "1",
          name: "John Doe",
          avatar: "J",
          role: "seller",
        },
        content: "I've initiated the refund. It should appear in your account within 2-3 business days.",
        timestamp: "2023-03-19T11:45:00",
      },
      {
        id: "MSG-5",
        user: {
          id: "5",
          name: "David Lee",
          avatar: "D",
          role: "buyer",
        },
        content: "I've received the refund. Thank you.",
        timestamp: "2023-03-20T09:30:00",
      },
    ],
    resolution: {
      type: "refund",
      amount: "₱950",
      date: "2023-03-20T09:45:00",
      notes: "Full refund processed after item return confirmed.",
    },
  },
  {
    id: "DSP-1004",
    title: "Damaged during shipping",
    buyer: {
      id: "2",
      name: "Jane Smith",
      avatar: "J",
      email: "jane.smith@minsu.edu.ph",
    },
    seller: {
      id: "3",
      name: "Alex Johnson",
      avatar: "A",
      email: "alex.johnson@minsu.edu.ph",
    },
    product: {
      id: "P-1004",
      name: "Study Desk",
      price: "₱2,500",
    },
    status: "open",
    priority: "medium",
    created: "2023-03-19T16:45:00",
    updated: "2023-03-20T10:30:00",
    description:
      "The desk arrived with a broken leg. The packaging was intact, so it seems it was damaged before shipping.",
    messages: [
      {
        id: "MSG-1",
        user: {
          id: "2",
          name: "Jane Smith",
          avatar: "J",
          role: "buyer",
        },
        content:
          "I received the desk today but one of the legs is broken. The packaging wasn't damaged, so it must have been broken before shipping.",
        timestamp: "2023-03-19T16:45:00",
      },
      {
        id: "MSG-2",
        user: {
          id: "3",
          name: "Alex Johnson",
          avatar: "A",
          role: "seller",
        },
        content:
          "I'm sorry to hear that. I checked the desk before shipping and it was in perfect condition. Can you send photos of the damage?",
        timestamp: "2023-03-19T17:30:00",
      },
      {
        id: "MSG-3",
        user: {
          id: "2",
          name: "Jane Smith",
          avatar: "J",
          role: "buyer",
        },
        content: "I've attached photos of the broken leg. As you can see, it's completely snapped off.",
        timestamp: "2023-03-19T18:15:00",
      },
    ],
  },
  {
    id: "DSP-1005",
    title: "Wrong item received",
    buyer: {
      id: "4",
      name: "Maria Santos",
      avatar: "M",
      email: "santos.maria@minsu.edu.ph",
    },
    seller: {
      id: "5",
      name: "David Lee",
      avatar: "D",
      email: "lee.david@minsu.edu.ph",
    },
    product: {
      id: "P-1005",
      name: "Wireless Headphones",
      price: "₱1,800",
    },
    status: "investigating",
    priority: "high",
    created: "2023-03-17T11:30:00",
    updated: "2023-03-19T14:15:00",
    description:
      "I ordered wireless headphones but received wired earbuds instead. The item is completely different from what was advertised.",
    messages: [
      {
        id: "MSG-1",
        user: {
          id: "4",
          name: "Maria Santos",
          avatar: "M",
          role: "buyer",
        },
        content: "I ordered wireless headphones but received wired earbuds instead. This is not what I paid for.",
        timestamp: "2023-03-17T11:30:00",
      },
      {
        id: "MSG-2",
        user: {
          id: "5",
          name: "David Lee",
          avatar: "D",
          role: "seller",
        },
        content:
          "I apologize for the mix-up. I must have sent the wrong package. I can send the correct headphones if you return the earbuds.",
        timestamp: "2023-03-17T13:45:00",
      },
      {
        id: "MSG-3",
        user: {
          id: "4",
          name: "Maria Santos",
          avatar: "M",
          role: "buyer",
        },
        content:
          "I don't want to pay for return shipping for your mistake. I'd like a full refund and I'll keep the earbuds as compensation for the inconvenience.",
        timestamp: "2023-03-17T15:20:00",
      },
      {
        id: "MSG-4",
        user: {
          id: "5",
          name: "David Lee",
          avatar: "D",
          email: "lee.david@minsu.edu.ph",
        },
        content:
          "I can cover the return shipping, but I can't provide a refund unless I get the earbuds back. They're still worth money.",
        timestamp: "2023-03-18T09:30:00",
      },
    ],
  },
]

export default function DisputesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedDispute, setSelectedDispute] = useState<any>(null)
  const [isDisputeDialogOpen, setIsDisputeDialogOpen] = useState(false)
  const [adminResponse, setAdminResponse] = useState("")

  // Filter disputes based on search term and filters
  const filteredDisputes = mockDisputes.filter((dispute) => {
    const matchesSearch =
      dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.product.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || dispute.status === statusFilter
    const matchesPriority = priorityFilter === "all" || dispute.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleResolveDispute = (resolution: string) => {
    if (!selectedDispute) return

    toast({
      title: "Dispute resolved",
      description: `Dispute ${selectedDispute.id} has been resolved with resolution: ${resolution}`,
    })

    setIsDisputeDialogOpen(false)
  }

  const handleSendResponse = () => {
    if (!selectedDispute || !adminResponse.trim()) return

    // Create a new message object
    const newMessage = {
      id: `MSG-${selectedDispute.messages.length + 1}`,
      user: {
        id: "admin",
        name: "Admin",
        avatar: "A",
        role: "admin",
      },
      content: adminResponse,
      timestamp: new Date().toISOString(),
    }

    // Update the selected dispute with the new message
    setSelectedDispute({
      ...selectedDispute,
      messages: [...selectedDispute.messages, newMessage],
    })

    toast({
      title: "Response sent",
      description: "Your response has been sent to both parties.",
    })

    // Clear the input field
    setAdminResponse("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="default" className="bg-blue-500">
            Open
          </Badge>
        )
      case "investigating":
        return (
          <Badge variant="default" className="bg-yellow-500">
            Investigating
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-500">
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return (
          <Badge variant="default" className="bg-yellow-500">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="default" className="bg-green-500">
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dispute Management</h1>
          <p className="text-gray-500">Manage and resolve user disputes</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge className="bg-red-500 text-white text-sm">
            {mockDisputes.filter((d) => d.status !== "resolved").length} Active Disputes
          </Badge>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search disputes..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setPriorityFilter("all")
                }}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Created
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDisputes.length > 0 ? (
              filteredDisputes.map((dispute) => (
                <TableRow key={dispute.id}>
                  <TableCell className="font-medium">{dispute.id}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={dispute.title}>
                      {dispute.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{dispute.buyer.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{dispute.buyer.name}</div>
                        <div className="text-xs text-gray-500">{dispute.buyer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{dispute.seller.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{dispute.seller.name}</div>
                        <div className="text-xs text-gray-500">{dispute.seller.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{dispute.product.name}</div>
                      <div className="text-xs text-green-600">{dispute.product.price}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                  <TableCell>{getPriorityBadge(dispute.priority)}</TableCell>
                  <TableCell>{new Date(dispute.created).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDispute(dispute)
                        setIsDisputeDialogOpen(true)
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  <div className="flex flex-col items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500 font-medium">No disputes found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dispute Details Dialog */}
      <Dialog open={isDisputeDialogOpen} onOpenChange={setIsDisputeDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Dispute Details: {selectedDispute?.id}</DialogTitle>
            <DialogDescription>{selectedDispute?.title}</DialogDescription>
          </DialogHeader>

          {selectedDispute && (
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="resolution">Resolution</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Buyer Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>{selectedDispute.buyer.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{selectedDispute.buyer.name}</div>
                            <div className="text-sm text-gray-500">{selectedDispute.buyer.email}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Seller Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>{selectedDispute.seller.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{selectedDispute.seller.name}</div>
                            <div className="text-sm text-gray-500">{selectedDispute.seller.email}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Product Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{selectedDispute.product.name}</div>
                          <div className="text-sm text-gray-500">Product ID: {selectedDispute.product.id}</div>
                        </div>
                        <div className="text-lg font-bold text-green-600">{selectedDispute.product.price}</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Dispute Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">Status</div>
                          <div>{getStatusBadge(selectedDispute.status)}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">Priority</div>
                          <div>{getPriorityBadge(selectedDispute.priority)}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">Created</div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(selectedDispute.created).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">Last Updated</div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(selectedDispute.updated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-1">Description</div>
                        <div className="p-3 bg-gray-50 rounded-md text-sm">{selectedDispute.description}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="messages">
                <div className="space-y-4">
                  <div className="max-h-80 overflow-y-auto space-y-4 p-1">
                    {selectedDispute.messages.map((message: any) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.user.role === "buyer"
                            ? "justify-start"
                            : message.user.role === "admin"
                              ? "justify-center"
                              : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.user.role === "buyer"
                              ? "bg-blue-50 text-blue-800"
                              : message.user.role === "admin"
                                ? "bg-gray-100 text-gray-800 border border-gray-200"
                                : "bg-green-50 text-green-800"
                          }`}
                        >
                          <div className="flex items-center mb-1">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>{message.user.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm font-medium">{message.user.name}</div>
                            <div className="text-xs ml-2 opacity-70">
                              {new Date(message.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div>{message.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Admin Response</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Type your response to both parties..."
                          value={adminResponse}
                          onChange={(e) => setAdminResponse(e.target.value)}
                          rows={3}
                        />
                        <Button onClick={handleSendResponse} disabled={!adminResponse.trim()}>
                          Send Response
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="resolution">
                <div className="space-y-4">
                  {selectedDispute.status === "resolved" && selectedDispute.resolution ? (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Resolution Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Resolution Type</div>
                            <div className="font-medium">{selectedDispute.resolution.type}</div>
                          </div>
                          {selectedDispute.resolution.amount && (
                            <div>
                              <div className="text-sm text-gray-500">Amount</div>
                              <div className="font-medium text-green-600">{selectedDispute.resolution.amount}</div>
                            </div>
                          )}
                          <div>
                            <div className="text-sm text-gray-500">Date</div>
                            <div className="font-medium">
                              {new Date(selectedDispute.resolution.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {selectedDispute.resolution.notes && (
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Notes</div>
                            <div className="p-3 bg-gray-50 rounded-md text-sm">{selectedDispute.resolution.notes}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Resolve Dispute</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleResolveDispute("Refund to buyer")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Refund to Buyer
                          </Button>
                          <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleResolveDispute("Partial refund")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Partial Refund
                          </Button>
                          <Button
                            className="bg-yellow-600 hover:bg-yellow-700"
                            onClick={() => handleResolveDispute("Replacement")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Replacement
                          </Button>
                          <Button
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={() => handleResolveDispute("Return and refund")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Return & Refund
                          </Button>
                          <Button
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleResolveDispute("Deny claim")}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Deny Claim
                          </Button>
                          <Button variant="outline" onClick={() => handleResolveDispute("Other resolution")}>
                            Other Resolution
                          </Button>
                        </div>

                        <div>
                          <div className="text-sm text-gray-500 mb-1">Resolution Notes</div>
                          <Textarea placeholder="Add notes about the resolution..." rows={3} />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDisputeDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
