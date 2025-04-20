"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Tv, Send, ArrowRight, MessageSquare, Calendar, Clock, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthStatus } from "@/components/auth-status"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Sample FAQ data
const faqs = [
  {
    question: "How much does it typically cost to repair a cracked phone screen?",
    answer:
      "The cost varies depending on the phone model. For iPhones, it ranges from $80-$320, while Android repairs typically range from $60-$200. We can provide an exact quote after assessing your device.",
  },
  {
    question: "My laptop won't turn on. What could be the issue?",
    answer:
      "This could be due to several issues: a dead battery, faulty power adapter, power jack issues, or hardware failure. Our technicians can diagnose the exact problem and recommend the appropriate repair.",
  },
  {
    question: "How long does a typical repair take?",
    answer:
      "Most common repairs (screen replacements, battery replacements) take 1-2 hours. More complex issues might take 1-3 business days. We'll provide you with an estimated timeframe after diagnosing your device.",
  },
  {
    question: "Do you offer warranty on repairs?",
    answer:
      "Yes, all our repairs come with a 90-day warranty covering both parts and labor. If you experience the same issue within the warranty period, we'll fix it at no additional cost.",
  },
  {
    question: "Can you recover data from a water-damaged device?",
    answer:
      "In many cases, yes. Our success rate for data recovery from water-damaged devices is about 80%. The key is to turn off the device immediately and bring it in as soon as possible without attempting to turn it on or charge it.",
  },
]

// Sample bot responses
const botResponses = {
  greeting:
    "Hello! I'm ElectroBot, your virtual assistant. How can I help you with your electronic repair needs today?",
  deviceType: "What type of device are you having issues with?",
  issueDescription: "Could you describe the issue you're experiencing with your device?",
  commonIssues: {
    smartphone: ["Cracked screen", "Battery not charging", "Water damage", "Software issues", "Camera not working"],
    laptop: ["Won't power on", "Slow performance", "Overheating", "Screen issues", "Keyboard problems"],
    tv: ["No picture", "No sound", "Power issues", "HDMI ports not working", "Screen flickering"],
    other: ["Device won't turn on", "Physical damage", "Performance issues", "Connectivity problems"],
  },
  responses: {
    "cracked screen":
      "Screen replacements are one of our most common repairs. Depending on your device model, this typically takes 1-2 hours and costs between $60-$320. Would you like to schedule a repair appointment?",
    battery:
      "Battery issues are usually straightforward to diagnose. It could be the battery itself or the charging system. Our technicians can run diagnostics and replace the necessary components. Most battery replacements take about an hour.",
    "water damage":
      "Water damage requires immediate attention. Please turn off your device if it's still on and don't attempt to charge it. Our technicians have specialized equipment to dry and clean the internal components and can often save water-damaged devices if brought in quickly.",
    "won't power on":
      "When a device won't power on, it could be due to several issues ranging from simple (dead battery, loose connection) to more complex (motherboard failure). Our diagnostic service can identify the exact cause and provide repair options.",
    slow: "Performance issues can be caused by hardware problems (like failing hard drives or insufficient RAM) or software issues. Our technicians can diagnose the root cause and either upgrade components or optimize your software.",
    overheating:
      "Overheating is often caused by dust buildup or failing cooling components. We offer professional cleaning services and can replace fans or heat sinks if necessary. This typically takes 1-2 hours.",
    default:
      "Thank you for providing that information. Based on what you've described, one of our technicians would need to examine your device for an accurate diagnosis. Would you like to schedule an in-person consultation, or would you prefer to chat with a live technician now?",
  },
  schedule:
    "Great! When would be a convenient time for you to bring in your device? We're open Monday-Friday from 9AM-6PM and Saturday from 10AM-4PM.",
  liveTech:
    "I'll connect you with a live technician who can provide more specific assistance. Please hold for a moment while I transfer you.",
  needMoreInfo: "To better assist you, could you provide a bit more information about the issue you're experiencing?",
  thankYou:
    "Thank you for providing that information. One of our technicians will review your case and contact you shortly. Is there anything else you'd like to know in the meantime?",
  closing:
    "Thank you for using our consultation service! If you have any more questions, feel free to ask anytime. Have a great day!",
}

type Message = {
  id: number
  sender: "user" | "bot"
  text: string
  timestamp: Date
  options?: string[]
}

export default function ConsultationPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: botResponses.greeting,
      timestamp: new Date(),
      options: [
        "I have a question about repairs",
        "I need help diagnosing an issue",
        "I want to schedule a consultation",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [deviceType, setDeviceType] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [consultationStep, setConsultationStep] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a message
  const handleSendMessage = (text = inputValue) => {
    if (!text.trim()) return

    // Add user message
    const userMessageId = messages.length + 1
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        sender: "user",
        text: text,
        timestamp: new Date(),
      },
    ])

    setInputValue("")
    setIsTyping(true)

    // Simulate bot thinking
    setTimeout(() => {
      let botResponse = ""
      let options: string[] = []

      // Simple response logic based on user input and consultation step
      const lowerText = text.toLowerCase()

      if (consultationStep === 0) {
        if (lowerText.includes("diagnos")) {
          botResponse = botResponses.deviceType
          options = ["Smartphone", "Laptop", "TV", "Tablet", "Other"]
          setConsultationStep(1)
        } else if (lowerText.includes("schedule")) {
          botResponse = botResponses.schedule
          setConsultationStep(4)
        } else if (lowerText.includes("question")) {
          botResponse = "What would you like to know about our repair services?"
          options = ["Repair costs", "Repair time", "Warranty information", "Available services"]
          setConsultationStep(5)
        } else {
          botResponse = botResponses.deviceType
          options = ["Smartphone", "Laptop", "TV", "Tablet", "Other"]
          setConsultationStep(1)
        }
      } else if (consultationStep === 1) {
        setDeviceType(lowerText)
        botResponse = botResponses.issueDescription

        // Show common issues based on device type
        let deviceCategory = "other"
        if (lowerText.includes("phone") || lowerText.includes("smartphone")) deviceCategory = "smartphone"
        if (lowerText.includes("laptop") || lowerText.includes("computer")) deviceCategory = "laptop"
        if (lowerText.includes("tv") || lowerText.includes("television")) deviceCategory = "tv"

        options = botResponses.commonIssues[deviceCategory] || botResponses.commonIssues.other
        setConsultationStep(2)
      } else if (consultationStep === 2) {
        // Try to match the issue with predefined responses
        if (lowerText.includes("screen") && lowerText.includes("crack")) {
          botResponse = botResponses.responses["cracked screen"]
        } else if (lowerText.includes("battery") || lowerText.includes("charg")) {
          botResponse = botResponses.responses["battery"]
        } else if (lowerText.includes("water")) {
          botResponse = botResponses.responses["water damage"]
        } else if (lowerText.includes("power") || lowerText.includes("turn on")) {
          botResponse = botResponses.responses["won't power on"]
        } else if (lowerText.includes("slow")) {
          botResponse = botResponses.responses["slow"]
        } else if (lowerText.includes("hot") || lowerText.includes("heat")) {
          botResponse = botResponses.responses["overheating"]
        } else {
          botResponse = botResponses.responses["default"]
        }

        options = ["Schedule an in-person consultation", "Chat with a live technician", "Get a repair quote"]
        setConsultationStep(3)
      } else if (consultationStep === 3) {
        if (lowerText.includes("schedule") || lowerText.includes("in-person")) {
          botResponse = botResponses.schedule
          setConsultationStep(4)
        } else if (lowerText.includes("live") || lowerText.includes("technician") || lowerText.includes("chat")) {
          botResponse = botResponses.liveTech
          options = ["I'll wait for a technician", "I'd rather schedule for later"]
          setConsultationStep(6)
        } else if (lowerText.includes("quote")) {
          botResponse =
            "To provide an accurate quote, we'd need a bit more information. Could you tell us the specific model of your device?"
          setConsultationStep(7)
        } else {
          botResponse = botResponses.needMoreInfo
          setConsultationStep(2)
        }
      } else if (consultationStep === 4) {
        botResponse =
          "Great! I've scheduled a consultation for you. You'll receive a confirmation email shortly with all the details. Is there anything else you'd like to know?"
        options = ["No, that's all for now", "Yes, I have another question"]
        setConsultationStep(8)
      } else if (consultationStep === 5) {
        // FAQ responses
        if (lowerText.includes("cost") || lowerText.includes("price")) {
          botResponse =
            "Repair costs vary depending on the device and issue. Screen repairs range from $60-$320, battery replacements from $40-$100, and water damage recovery from $100-$300. We can provide an exact quote after diagnosing your device."
        } else if (lowerText.includes("time") || lowerText.includes("long")) {
          botResponse =
            "Most common repairs take 1-2 hours if we have the parts in stock. More complex issues might take 1-3 business days. We'll provide you with an estimated timeframe after diagnosing your device."
        } else if (lowerText.includes("warranty")) {
          botResponse =
            "All our repairs come with a 90-day warranty covering both parts and labor. If you experience the same issue within the warranty period, we'll fix it at no additional cost."
        } else if (lowerText.includes("service")) {
          botResponse =
            "We offer a wide range of repair services including screen replacements, battery replacements, water damage recovery, data recovery, hardware upgrades, software troubleshooting, and more. Is there a specific service you're interested in?"
        } else {
          botResponse =
            "I'm not sure I understood your question. Could you try rephrasing it, or select one of the common topics below?"
          options = ["Repair costs", "Repair time", "Warranty information", "Available services"]
        }

        if (!options.length) {
          options = ["I have another question", "I'd like to schedule a repair", "That's all for now"]
        }
      } else if (consultationStep === 6 || consultationStep === 7) {
        botResponse = botResponses.thankYou
        options = ["I have another question", "That's all for now"]
        setConsultationStep(8)
      } else if (consultationStep === 8) {
        if (lowerText.includes("yes") || lowerText.includes("another")) {
          botResponse = "What else would you like to know?"
          options = ["Repair costs", "Repair time", "Warranty information", "Available services"]
          setConsultationStep(5)
        } else {
          botResponse = botResponses.closing
          setConsultationStep(9)
        }
      }

      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          id: userMessageId + 1,
          sender: "bot",
          text: botResponse,
          timestamp: new Date(),
          options: options,
        },
      ])

      setIsTyping(false)
    }, 1000)
  }

  // Handle option selection
  const handleOptionClick = (option: string) => {
    handleSendMessage(option)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Tv className="h-6 w-6" />
            <span>ElectroFix</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/technicians" className="text-sm font-medium">
              Find Technicians
            </Link>
            <Link href="/about" className="text-sm font-medium">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium">
              Contact
            </Link>
          </nav>
          <AuthStatus />
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Virtual Consultation Booth</h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Get expert advice about your electronic repair needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="chat" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Chat Consultation
                  </TabsTrigger>
                  <TabsTrigger value="faq" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Common Questions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="mt-4">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="ElectroBot" />
                          <AvatarFallback>EB</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold">ElectroBot</div>
                          <div className="text-xs text-gray-500">Online • Virtual Assistant</div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px] overflow-y-auto p-4 space-y-4 border rounded-md">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"} rounded-lg px-4 py-2`}
                            >
                              {message.sender === "bot" && (
                                <div className="flex items-center gap-2 mb-1">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt="ElectroBot" />
                                    <AvatarFallback className="text-xs">EB</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs font-medium">ElectroBot</span>
                                </div>
                              )}
                              <p>{message.text}</p>
                              {message.options && message.options.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {message.options.map((option, index) => (
                                    <Button
                                      key={index}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleOptionClick(option)}
                                      className="text-xs bg-background"
                                    >
                                      {option}
                                    </Button>
                                  ))}
                                </div>
                              )}
                              <div className="text-xs opacity-50 mt-1">
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-muted rounded-lg px-4 py-2">
                              <div className="flex items-center gap-1">
                                <div
                                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                  style={{ animationDelay: "0ms" }}
                                ></div>
                                <div
                                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                  style={{ animationDelay: "150ms" }}
                                ></div>
                                <div
                                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                  style={{ animationDelay: "300ms" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <form
                        className="flex w-full items-center space-x-2"
                        onSubmit={(e) => {
                          e.preventDefault()
                          handleSendMessage()
                        }}
                      >
                        <Input
                          type="text"
                          placeholder="Type your message..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" size="icon">
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Send</span>
                        </Button>
                      </form>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="faq" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Frequently Asked Questions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {faqs.map((faq, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                          <p className="text-gray-500">{faq.answer}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Schedule a Consultation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="device-type">Device Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select device type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smartphone">Smartphone</SelectItem>
                        <SelectItem value="laptop">Laptop</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="desktop">Desktop Computer</SelectItem>
                        <SelectItem value="tv">TV</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issue">Describe Your Issue</Label>
                    <Textarea id="issue" placeholder="Please describe the problem you're experiencing..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferred-date">Preferred Date</Label>
                    <Input id="preferred-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferred-time">Preferred Time</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12PM - 3PM)</SelectItem>
                        <SelectItem value="evening">Evening (3PM - 6PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Consultation
                  </Button>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Why Choose Us?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Fast Turnaround</h3>
                      <p className="text-sm text-gray-500">Most repairs completed same-day</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Badge className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">90-Day Warranty</h3>
                      <p className="text-sm text-gray-500">All repairs backed by our guarantee</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <HelpCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Expert Technicians</h3>
                      <p className="text-sm text-gray-500">Certified and experienced professionals</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Learn More About Our Services
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Tv className="h-6 w-6" />
              <span>ElectroFix</span>
            </div>
            <p className="text-sm text-gray-500">
              Connecting you with expert technicians for all your electronic repair needs.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div className="space-y-2">
              <h4 className="font-medium">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-gray-500 hover:text-gray-900">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-500 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-500 hover:text-gray-900">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-gray-500 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-500 hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-gray-500">© 2024 ElectroFix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
