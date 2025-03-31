"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, ExternalLink, CheckCircle, Clock, BarChart, Code, AlertTriangle, CheckSquare, X, HelpCircle, Play, PauseCircle, Share2, MessageSquare } from "lucide-react"

// Mock data for DSA questions by category
const dsaQuestionsByCategory = {
  "Arrays & Strings": [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      topic: "Arrays",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/two-sum/",
      completed: true,
      timeSpent: 25, // minutes
      accuracy: 100, // percentage
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      companies: ["Google", "Amazon", "Microsoft", "Facebook"],
      roles: ["SDE", "Frontend", "Backend"],
      salaryLevel: ["Low", "Medium", "High"],
    },
    {
      id: 2,
      title: "Valid Anagram",
      difficulty: "Easy",
      topic: "Strings",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/valid-anagram/",
      completed: false,
      timeSpent: 0,
      accuracy: 0,
      description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
      companies: ["Amazon", "Microsoft"],
      roles: ["SDE", "Frontend"],
      salaryLevel: ["Low", "Medium"],
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      topic: "Strings",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      completed: false,
      timeSpent: 0,
      accuracy: 0,
      description: "Given a string s, find the length of the longest substring without repeating characters.",
      companies: ["Google", "Facebook", "Amazon"],
      roles: ["SDE", "Backend"],
      salaryLevel: ["Medium", "High"],
    },
  ],
  "Linked Lists": [
    {
      id: 4,
      title: "Reverse Linked List",
      difficulty: "Easy",
      topic: "Linked Lists",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/reverse-linked-list/",
      completed: true,
      timeSpent: 15,
      accuracy: 90,
      description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
      companies: ["Google", "Microsoft", "Apple"],
      roles: ["SDE", "Backend"],
      salaryLevel: ["Low", "Medium", "High"],
    },
    {
      id: 5,
      title: "Merge Two Sorted Lists",
      difficulty: "Easy",
      topic: "Linked Lists",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/merge-two-sorted-lists/",
      completed: false,
      timeSpent: 0,
      accuracy: 0,
      description: "Merge two sorted linked lists and return it as a sorted list.",
      companies: ["Amazon", "Microsoft"],
      roles: ["SDE"],
      salaryLevel: ["Low", "Medium"],
    },
  ],
  "Trees & Graphs": [
    {
      id: 6,
      title: "Binary Tree Level Order Traversal",
      difficulty: "Medium",
      topic: "Trees",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      completed: false,
      timeSpent: 0,
      accuracy: 0,
      description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
      companies: ["Google", "Facebook", "Microsoft"],
      roles: ["SDE", "Backend"],
      salaryLevel: ["Medium", "High"],
    },
    {
      id: 7,
      title: "Number of Islands",
      difficulty: "Medium",
      topic: "Graphs",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/number-of-islands/",
      completed: false,
      timeSpent: 0,
      accuracy: 0,
      description:
        "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
      companies: ["Amazon", "Google", "Facebook"],
      roles: ["SDE", "ML Engineer"],
      salaryLevel: ["Medium", "High"],
    },
  ],
  "Dynamic Programming": [
    {
      id: 8,
      title: "Maximum Subarray",
      difficulty: "Medium",
      topic: "Dynamic Programming",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/maximum-subarray/",
      completed: false,
      timeSpent: 0,
      accuracy: 0,
      description:
        "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
      companies: ["Google", "Amazon", "Microsoft"],
      roles: ["SDE", "ML Engineer"],
      salaryLevel: ["Medium", "High"],
    },
    {
      id: 9,
      title: "Climbing Stairs",
      difficulty: "Easy",
      topic: "Dynamic Programming",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/climbing-stairs/",
      completed: false,
      timeSpent: 0,
      accuracy: 0,
      description:
        "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      companies: ["Amazon", "Microsoft"],
      roles: ["SDE", "Frontend"],
      salaryLevel: ["Low", "Medium"],
    },
  ],
  "Sorting & Searching": [
    {
      id: 10,
      title: "Binary Search",
      difficulty: "Easy",
      topic: "Searching",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/binary-search/",
      completed: false,
      timeSpent: 0,
      accuracy: 0,
      description:
        "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.",
      companies: ["Google", "Amazon", "Microsoft"],
      roles: ["SDE", "Frontend", "Backend"],
      salaryLevel: ["Low", "Medium", "High"],
    },
    {
      id: 11,
      title: "Merge Sort",
      difficulty: "Medium",
      topic: "Sorting",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/sort-an-array/",
      completed: false,
      timeSpent: 0,
      accuracy: 0,
      description: "Given an array of integers nums, sort the array in ascending order using the merge sort algorithm.",
      companies: ["Google", "Facebook", "Microsoft"],
      roles: ["SDE", "Backend"],
      salaryLevel: ["Medium", "High"],
    },
  ],
  "System Design": [
    {
      id: 12,
      title: "Design a URL Shortener",
      difficulty: "Medium",
      topic: "System Design",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/design-tinyurl/",
      completed: false,
      timeSpent: 0,
      accuracy: 0,
      description:
        "Design a URL shortener service that can shorten a long URL to a shorter one and expand the short URL to the original long URL.",
      companies: ["Google", "Amazon", "Facebook"],
      roles: ["SDE", "Backend", "System Engineer"],
      salaryLevel: ["Medium", "High"],
    },
    {
      id: 13,
      title: "Design a Rate Limiter",
      difficulty: "Hard",
      topic: "System Design",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/design-hit-counter/",
      completed: false,
      timeSpent: 0,
      accuracy: 0,
      description:
        "Design a rate limiter that can limit the number of requests a client can make within a certain time window.",
      companies: ["Google", "Facebook", "Netflix"],
      roles: ["SDE", "Backend", "System Engineer"],
      salaryLevel: ["High"],
    },
  ],
}

// Mock data for daily challenges
const dailyChallenges = [
  {
    id: 101,
    title: "Daily Challenge: Reverse Linked List",
    difficulty: "Medium",
    topic: "Linked Lists",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/reverse-linked-list/",
    date: "Today",
  },
  {
    id: 102,
    title: "Daily Challenge: Valid Anagram",
    difficulty: "Easy",
    topic: "Strings",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/valid-anagram/",
    date: "Tomorrow",
  },
]

// Sample code for debugging
const sampleBuggyCode = `function findMaxSubarraySum(arr) {
  let maxSoFar = 0;
  let maxEndingHere = 0;
  
  for (let i = 0; i < arr.length; i++) {
    maxEndingHere = maxEndingHere + arr[i];
    
    if (maxEndingHere < 0) {
      maxEndingHere = 0;
    }
    
    if (maxSoFar < maxEndingHere) {
      maxSoFar = maxEndingHere;
    }
  }
  
  return maxSoFar;
}

// This fails for arrays with all negative numbers
console.log(findMaxSubarraySum([-2, -3, -4, -1, -2])); // Returns 0 instead of -1`

const sampleFixedCode = `function findMaxSubarraySum(arr) {
  if (arr.length === 0) return 0;
  
  let maxSoFar = arr[0];
  let maxEndingHere = arr[0];
  
  for (let i = 1; i < arr.length; i++) {
    // Either extend the previous subarray or start a new one
    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
    
    // Update max so far if needed
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }
  
  return maxSoFar;
}

// Now correctly handles arrays with all negative numbers
console.log(findMaxSubarraySum([-2, -3, -4, -1, -2])); // Returns -1`

export default function DSAPractice() {
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("All")
  const [topicFilter, setTopicFilter] = useState("All")
  const [platformFilter, setPlatformFilter] = useState("All")
  const [companyFilter, setCompanyFilter] = useState("All")
  const [roleFilter, setRoleFilter] = useState("All")
  const [salaryLevelFilter, setSalaryLevelFilter] = useState("All")
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedSalaryLevel, setSelectedSalaryLevel] = useState("")
  const [codeToDebug, setCodeToDebug] = useState("")
  const [showDebugDialog, setShowDebugDialog] = useState(false)
  const [debugResult, setDebugResult] = useState(null)
  const [isDebugging, setIsDebugging] = useState(false)
  const [showFeatureOverview, setShowFeatureOverview] = useState(false)
  
  // New mock interview state variables
  const [interviewInProgress, setInterviewInProgress] = useState(false)
  const [interviewSettings, setInterviewSettings] = useState({
    company: "Google",
    difficulty: "Medium",
    topic: "Arrays & Strings"
  })
  const [interviewQuestion, setInterviewQuestion] = useState(null)
  const [interviewSolution, setInterviewSolution] = useState("")
  const [interviewStartTime, setInterviewStartTime] = useState(null)
  const [interviewElapsedTime, setInterviewElapsedTime] = useState(0)
  const [interviewFeedback, setInterviewFeedback] = useState(null)
  const [interviewer, setInterviewer] = useState("Technical Interviewer")
  const [interviewMessages, setInterviewMessages] = useState([])
  const [userMessage, setUserMessage] = useState("")

  // Flatten all questions for filtering
  const allQuestions = Object.values(dsaQuestionsByCategory).flat()

  // Filter questions based on search and filters
  const filteredQuestions = allQuestions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = difficultyFilter === "All" || question.difficulty === difficultyFilter
    const matchesTopic = topicFilter === "All" || question.topic === topicFilter
    const matchesPlatform = platformFilter === "All" || question.platform === platformFilter
    const matchesCompany = companyFilter === "All" || question.companies.includes(companyFilter)
    const matchesRole = roleFilter === "All" || question.roles.includes(roleFilter)
    const matchesSalaryLevel = salaryLevelFilter === "All" || question.salaryLevel.includes(salaryLevelFilter)

    return (
      matchesSearch &&
      matchesDifficulty &&
      matchesTopic &&
      matchesPlatform &&
      matchesCompany &&
      matchesRole &&
      matchesSalaryLevel
    )
  })

  // Calculate progress stats
  const totalQuestions = allQuestions.length
  const completedQuestions = allQuestions.filter((q) => q.completed).length
  const completionRate = Math.round((completedQuestions / totalQuestions) * 100)

  // Get unique topics, platforms, companies, roles for filters
  const topics = [...new Set(allQuestions.map((q) => q.topic))]
  const platforms = [...new Set(allQuestions.map((q) => q.platform))]
  const companies = [...new Set(allQuestions.flatMap((q) => q.companies || []))]
  const roles = [...new Set(allQuestions.flatMap((q) => q.roles || []))]
  const salaryLevels = ["Low", "Medium", "High"]

  const applyRoleFilters = () => {
    if (selectedCompany) setCompanyFilter(selectedCompany)
    if (selectedRole) setRoleFilter(selectedRole)
    if (selectedSalaryLevel) setSalaryLevelFilter(selectedSalaryLevel)
    setShowRoleDialog(false)
  }

  const handleDebugCode = () => {
    setIsDebugging(true)

    // Simulate LLM processing
    setTimeout(() => {
      setDebugResult({
        issues: [
          "The algorithm fails for arrays with all negative numbers because it initializes maxSoFar to 0",
          "When all elements are negative, the function will return 0 instead of the largest (least negative) sum",
          "The algorithm resets maxEndingHere to 0 when it becomes negative, which is incorrect for all-negative arrays",
        ],
        solution: sampleFixedCode,
        explanation:
          "The Kadane's algorithm implementation has a bug when handling arrays with all negative numbers. The correct implementation should initialize maxSoFar and maxEndingHere to the first element of the array, and then compare each element with the sum of the current element and maxEndingHere.",
      })
      setIsDebugging(false)
    }, 2000)
  }

  // Handle starting a mock interview
  const startMockInterview = () => {
    // Reset interview state
    setInterviewInProgress(true)
    setInterviewStartTime(Date.now())
    setInterviewElapsedTime(0)
    setInterviewFeedback(null)
    setInterviewSolution("")
    setInterviewMessages([
      {
        role: "interviewer",
        content: `Hello! I'm your ${interviewSettings.company} technical interviewer today. Let's start with a ${interviewSettings.difficulty.toLowerCase()} difficulty problem on ${interviewSettings.topic.toLowerCase()}.`
      }
    ])
    
    // Select a question based on settings
    const topicKey = Object.keys(dsaQuestionsByCategory).find(
      key => key.toLowerCase().includes(interviewSettings.topic.toLowerCase())
    ) || Object.keys(dsaQuestionsByCategory)[0];
    
    const questions = dsaQuestionsByCategory[topicKey];
    const filteredQuestions = questions.filter(q => 
      q.difficulty === interviewSettings.difficulty && !q.completed
    );
    
    // If no matching questions, pick any from the topic
    const question = filteredQuestions.length > 0 
      ? filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)]
      : questions[Math.floor(Math.random() * questions.length)];
    
    setInterviewQuestion(question);
    
    // Add question details as a message
    setTimeout(() => {
      setInterviewMessages(prev => [
        ...prev,
        {
          role: "interviewer",
          content: `Here's your problem: **${question.title}**\n\n${question.description}\n\nPlease think through your approach before coding. Feel free to ask me any clarifying questions.`
        }
      ]);
    }, 1000);
    
    // Start timer for elapsed time
    const timerInterval = setInterval(() => {
      setInterviewElapsedTime(prev => prev + 1);
    }, 1000);
    
    // Store interval ID in a ref so we can clean it up later
    window.interviewTimerInterval = timerInterval;
  };
  
  // Handle ending an interview
  const endMockInterview = () => {
    // Clear timer
    if (window.interviewTimerInterval) {
      clearInterval(window.interviewTimerInterval);
    }
    
    setInterviewInProgress(false);
    
    // Generate feedback
    const timeTaken = Math.floor((Date.now() - interviewStartTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    
    setTimeout(() => {
      setInterviewFeedback({
        communicationScore: 8,
        problemSolvingScore: 7,
        codeQualityScore: 8,
        overallScore: 7.5,
        timeSpent: `${minutes}m ${seconds}s`,
        strengths: [
          "Good initial clarification of the problem",
          "Clear explanation of your approach",
          "Identified edge cases proactively"
        ],
        improvements: [
          "Consider optimizing the time complexity further",
          "Make sure to test with more diverse test cases",
          "Could improve variable naming for better readability"
        ],
        suggestions: "Practice more problems related to dynamic programming and optimization techniques. Also, try to verbalize your thought process more consistently throughout the interview."
      });
    }, 1500);
  };
  
  // Handle sending a message in the interview
  const sendInterviewMessage = () => {
    if (!userMessage.trim()) return;
    
    // Add user message
    setInterviewMessages(prev => [
      ...prev,
      {
        role: "user",
        content: userMessage
      }
    ]);
    
    // Clear input
    setUserMessage("");
    
    // Simulate interviewer response
    setTimeout(() => {
      let response = "That's a good point. Could you elaborate on your approach?";
      
      if (userMessage.toLowerCase().includes("time complexity") || userMessage.toLowerCase().includes("big o")) {
        response = "Yes, let's analyze the time complexity. For this problem, we should aim for better than O(n²) if possible.";
      } else if (userMessage.toLowerCase().includes("edge case") || userMessage.toLowerCase().includes("corner case")) {
        response = "Good thinking! Edge cases are important. Make sure to consider empty arrays and special input values.";
      } else if (userMessage.toLowerCase().includes("clarify") || userMessage.toLowerCase().includes("question")) {
        response = "To clarify: you can assume all inputs are valid according to the problem description. No additional constraints.";
      }
      
      setInterviewMessages(prev => [
        ...prev,
        {
          role: "interviewer",
          content: response
        }
      ]);
    }, 1000);
  };

  // Format time for display (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">DSA Practice Questions</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowFeatureOverview(true)}
          className="flex items-center gap-1"
        >
          <HelpCircle className="h-4 w-4" />
          Feature Overview
        </Button>
      </div>

      {/* Role Selection Banner */}
      <Card className="mb-8 bg-primary/5 border-primary/20 animate-slide-in">
        <CardContent className="flex flex-col md:flex-row justify-between items-center p-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Personalize Your DSA Practice</h2>
            <p className="text-muted-foreground">
              Get questions tailored to your target role, company, and salary level
            </p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => setShowRoleDialog(true)}>
            Set Your Interview Goals
          </Button>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card className="mb-8 animate-slide-in" style={{ animationDelay: "0.1s" }}>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>Track your DSA practice journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Completion Rate</span>
              <div className="flex items-center mt-1">
                <Progress value={completionRate} className="flex-1 mr-2 animate-progress" />
                <span className="text-sm font-medium">{completionRate}%</span>
              </div>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <span className="text-sm text-muted-foreground">Completed</span>
                <p className="font-medium">
                  {completedQuestions} of {totalQuestions}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-primary mr-2" />
              <div>
                <span className="text-sm text-muted-foreground">Difficulty Breakdown</span>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900">
                    Easy: 2/5
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900">
                    Medium: 0/6
                  </Badge>
                  <Badge variant="outline" className="bg-red-100 dark:bg-red-900">
                    Hard: 0/2
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card className="lg:col-span-1 h-fit animate-slide-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="difficulty-filter">Difficulty</Label>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger id="difficulty-filter" className="w-full mt-1">
                    <SelectValue placeholder="All Difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Difficulties</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="topic-filter">Topic</Label>
                <Select value={topicFilter} onValueChange={setTopicFilter}>
                  <SelectTrigger id="topic-filter" className="w-full mt-1">
                    <SelectValue placeholder="All Topics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Topics</SelectItem>
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="platform-filter">Platform</Label>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger id="platform-filter" className="w-full mt-1">
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Platforms</SelectItem>
                    {platforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {companyFilter !== "All" && (
                <div>
                  <Label htmlFor="company-filter">Company</Label>
                  <Select value={companyFilter} onValueChange={setCompanyFilter}>
                    <SelectTrigger id="company-filter" className="w-full mt-1">
                      <SelectValue placeholder="All Companies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Companies</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {roleFilter !== "All" && (
                <div>
                  <Label htmlFor="role-filter">Role</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger id="role-filter" className="w-full mt-1">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Roles</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {salaryLevelFilter !== "All" && (
                <div>
                  <Label htmlFor="salary-filter">Salary Level</Label>
                  <Select value={salaryLevelFilter} onValueChange={setSalaryLevelFilter}>
                    <SelectTrigger id="salary-filter" className="w-full mt-1">
                      <SelectValue placeholder="All Salary Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Salary Levels</SelectItem>
                      {salaryLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setDifficultyFilter("All")
                  setTopicFilter("All")
                  setPlatformFilter("All")
                  setCompanyFilter("All")
                  setRoleFilter("All")
                  setSalaryLevelFilter("All")
                  setSearchQuery("")
                }}
              >
                Reset Filters
              </Button>
            </div>

            <div className="pt-2">
              <Button variant="outline" className="w-full flex items-center" onClick={() => setShowDebugDialog(true)}>
                <Code className="mr-2 h-4 w-4" />
                Debug Your Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <div className="lg:col-span-3 animate-slide-in" style={{ animationDelay: "0.3s" }}>
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Questions</TabsTrigger>
              <TabsTrigger value="daily">Daily Challenges</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
              <TabsTrigger value="mock-interview">Mock Interview</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {/* Applied Filters */}
              {(companyFilter !== "All" || roleFilter !== "All" || salaryLevelFilter !== "All") && (
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Applied filters:</span>

                  {companyFilter !== "All" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Company: {companyFilter}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => setCompanyFilter("All")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}

                  {roleFilter !== "All" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Role: {roleFilter}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => setRoleFilter("All")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}

                  {salaryLevelFilter !== "All" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Salary: {salaryLevelFilter}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => setSalaryLevelFilter("All")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Expandable Question Categories */}
              {filteredQuestions.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                  {Object.entries(dsaQuestionsByCategory).map(([category, questions]) => {
                    // Filter questions in this category based on current filters
                    const filteredCategoryQuestions = questions.filter((question) => {
                      const matchesSearch =
                        question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        question.description.toLowerCase().includes(searchQuery.toLowerCase())
                      const matchesDifficulty = difficultyFilter === "All" || question.difficulty === difficultyFilter
                      const matchesTopic = topicFilter === "All" || question.topic === topicFilter
                      const matchesPlatform = platformFilter === "All" || question.platform === platformFilter
                      const matchesCompany = companyFilter === "All" || question.companies.includes(companyFilter)
                      const matchesRole = roleFilter === "All" || question.roles.includes(roleFilter)
                      const matchesSalaryLevel =
                        salaryLevelFilter === "All" || question.salaryLevel.includes(salaryLevelFilter)

                      return (
                        matchesSearch &&
                        matchesDifficulty &&
                        matchesTopic &&
                        matchesPlatform &&
                        matchesCompany &&
                        matchesRole &&
                        matchesSalaryLevel
                      )
                    })

                    // Only show categories that have matching questions
                    if (filteredCategoryQuestions.length === 0) return null

                    return (
                      <AccordionItem key={category} value={category} className="animate-slide-in">
                        <AccordionTrigger className="text-lg font-medium hover:no-underline">
                          {category} <Badge className="ml-2">{filteredCategoryQuestions.length}</Badge>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            {filteredCategoryQuestions.map((question) => (
                              <Card
                                key={question.id}
                                className={`transition-all duration-300 hover:shadow-md ${question.completed ? "border-green-500" : ""}`}
                              >
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{question.title}</CardTitle>
                                    {question.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                                  </div>
                                  <CardDescription>{question.platform}</CardDescription>
                                </CardHeader>
                                <CardContent className="pb-2">
                                  <p className="text-sm mb-3">{question.description}</p>

                                  <div className="flex flex-wrap gap-2 mb-2">
                                    <Badge
                                      className={
                                        question.difficulty === "Easy"
                                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                          : question.difficulty === "Medium"
                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                      }
                                    >
                                      {question.difficulty}
                                    </Badge>
                                    <Badge variant="outline">{question.topic}</Badge>

                                    {question.companies && question.companies.length > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                      >
                                        {question.companies[0]}
                                        {question.companies.length > 1 ? ` +${question.companies.length - 1}` : ""}
                                      </Badge>
                                    )}
                                  </div>

                                  {question.completed && (
                                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                                      <Clock className="h-4 w-4 mr-1" />
                                      <span>{question.timeSpent} mins</span>
                                      <span className="mx-2">•</span>
                                      <span>Accuracy: {question.accuracy}%</span>
                                    </div>
                                  )}
                                </CardContent>
                                <CardFooter>
                                  <Button variant="outline" className="w-full" asChild>
                                    <a href={question.url} target="_blank" rel="noopener noreferrer">
                                      Practice <ExternalLink className="h-4 w-4 ml-2" />
                                    </a>
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-lg">
                  <AlertTriangle className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-1">No questions match your search criteria</h3>
                  <p className="mb-4">Try adjusting your filters or search query</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDifficultyFilter("All")
                      setTopicFilter("All")
                      setPlatformFilter("All")
                      setCompanyFilter("All")
                      setRoleFilter("All")
                      setSalaryLevelFilter("All")
                      setSearchQuery("")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="daily" className="mt-6">
              <h3 className="text-xl font-medium mb-4">Daily DSA Challenges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dailyChallenges.map((challenge) => (
                  <Card key={challenge.id} className="animate-slide-in">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        <Badge>{challenge.date}</Badge>
                      </div>
                      <CardDescription>{challenge.platform}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          className={
                            challenge.difficulty === "Easy"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : challenge.difficulty === "Medium"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }
                        >
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant="outline">{challenge.topic}</Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <a href={challenge.url} target="_blank" rel="noopener noreferrer">
                          Take Challenge <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <h3 className="text-xl font-medium mb-4">Completed Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allQuestions
                  .filter((q) => q.completed)
                  .map((question) => (
                    <Card key={question.id} className="border-green-500 animate-slide-in">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{question.title}</CardTitle>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <CardDescription>{question.platform}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge
                            className={
                              question.difficulty === "Easy"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : question.difficulty === "Medium"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }
                          >
                            {question.difficulty}
                          </Badge>
                          <Badge variant="outline">{question.topic}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-2">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{question.timeSpent} mins</span>
                          <span className="mx-2">•</span>
                          <span>Accuracy: {question.accuracy}%</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <a href={question.url} target="_blank" rel="noopener noreferrer">
                            Review <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="bookmarked" className="mt-6">
              <div className="text-center py-12 border rounded-lg animate-fade-in">
                <h3 className="text-xl font-medium mb-2">No Bookmarked Questions Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Bookmark your favorite questions to access them quickly later.
                </p>
                <Button variant="outline">Browse All Questions</Button>
              </div>
            </TabsContent>

            {/* New Mock Interview Tab */}
            <TabsContent value="mock-interview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Interview Simulator</CardTitle>
                  <CardDescription>
                    Practice your DSA skills in a realistic interview environment with an AI interviewer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!interviewInProgress && !interviewFeedback ? (
                    <div className="space-y-6">
                      <div className="text-center py-6">
                        <h3 className="text-xl font-medium mb-4">Configure Your Mock Interview</h3>
                        <p className="text-muted-foreground mb-6">
                          Set up your interview parameters to match your target company and preferences
                        </p>
                      </div>
                      
                      <div className="grid gap-6 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="company-select">Target Company</Label>
                          <Select 
                            value={interviewSettings.company} 
                            onValueChange={(value) => setInterviewSettings(prev => ({...prev, company: value}))}
                          >
                            <SelectTrigger id="company-select">
                              <SelectValue placeholder="Select company" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Google">Google</SelectItem>
                              <SelectItem value="Amazon">Amazon</SelectItem>
                              <SelectItem value="Microsoft">Microsoft</SelectItem>
                              <SelectItem value="Facebook">Facebook</SelectItem>
                              <SelectItem value="Apple">Apple</SelectItem>
                              <SelectItem value="Netflix">Netflix</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="difficulty-select">Difficulty Level</Label>
                          <Select 
                            value={interviewSettings.difficulty}
                            onValueChange={(value) => setInterviewSettings(prev => ({...prev, difficulty: value}))}
                          >
                            <SelectTrigger id="difficulty-select">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Easy">Easy</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="topic-select">Topic Focus</Label>
                          <Select 
                            value={interviewSettings.topic}
                            onValueChange={(value) => setInterviewSettings(prev => ({...prev, topic: value}))}
                          >
                            <SelectTrigger id="topic-select">
                              <SelectValue placeholder="Select topic" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(dsaQuestionsByCategory).map(category => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="bg-secondary/20 rounded-lg p-6 mt-4">
                        <h4 className="font-medium mb-2 flex items-center">
                          <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                          Interview Tips
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                          <li>Speak your thoughts out loud as you solve the problem</li>
                          <li>Ask clarifying questions before diving into the solution</li>
                          <li>Start with a brute force approach and then optimize</li>
                          <li>Discuss time and space complexity of your solution</li>
                          <li>Test your code with example inputs and edge cases</li>
                        </ul>
                      </div>
                      
                      <div className="flex justify-center pt-4">
                        <Button 
                          size="lg" 
                          className="flex items-center gap-2" 
                          onClick={startMockInterview}
                        >
                          <Play className="h-4 w-4" />
                          Start Interview
                        </Button>
                      </div>
                    </div>
                  ) : interviewInProgress ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            {interviewSettings.company[0]}
                          </div>
                          <div className="ml-2">
                            <p className="font-medium text-sm">{interviewer}</p>
                            <p className="text-xs text-muted-foreground">{interviewSettings.company}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{formatTime(interviewElapsedTime)}</span>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={endMockInterview}
                          >
                            <PauseCircle className="h-4 w-4" />
                            End Interview
                          </Button>
                        </div>
                      </div>
                      
                      {/* Chat and code editor area */}
                      <div className="grid md:grid-cols-2 gap-4 h-[500px]">
                        {/* Chat with interviewer */}
                        <div className="border rounded-md flex flex-col">
                          <div className="p-3 border-b">
                            <h3 className="font-medium">Interview Discussion</h3>
                          </div>
                          
                          <div className="flex-1 overflow-auto p-3 space-y-4">
                            {interviewMessages.map((message, index) => (
                              <div 
                                key={index} 
                                className={`flex ${message.role === 'interviewer' ? 'justify-start' : 'justify-end'}`}
                              >
                                <div 
                                  className={`max-w-[80%] rounded-lg p-3 ${
                                    message.role === 'interviewer' 
                                      ? 'bg-secondary/30 text-foreground' 
                                      : 'bg-primary text-primary-foreground'
                                  }`}
                                >
                                  <div className="prose prose-sm dark:prose-invert" 
                                    dangerouslySetInnerHTML={{ 
                                      __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>') 
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="p-3 border-t flex gap-2">
                            <Input 
                              placeholder="Ask a question or respond to the interviewer..." 
                              value={userMessage}
                              onChange={(e) => setUserMessage(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && sendInterviewMessage()}
                            />
                            <Button onClick={sendInterviewMessage}>Send</Button>
                          </div>
                        </div>
                        
                        {/* Code editor */}
                        <div className="border rounded-md flex flex-col">
                          <div className="p-3 border-b">
                            <h3 className="font-medium">Your Solution</h3>
                          </div>
                          
                          <div className="flex-1 p-0">
                            <Textarea 
                              className="h-full resize-none font-mono text-sm p-4 border-0"
                              placeholder="Write your code solution here..."
                              value={interviewSolution}
                              onChange={(e) => setInterviewSolution(e.target.value)}
                            />
                          </div>
                          
                          <div className="p-3 border-t flex justify-between">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // Implement run code feature if needed
                                alert("Code execution feature coming soon!");
                              }}
                            >
                              Run Code
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setInterviewMessages(prev => [
                                  ...prev,
                                  {
                                    role: "user",
                                    content: "Here's my solution:\n```\n" + interviewSolution + "\n```"
                                  }
                                ]);
                                
                                setTimeout(() => {
                                  setInterviewMessages(prev => [
                                    ...prev,
                                    {
                                      role: "interviewer",
                                      content: "Thanks for sharing your solution. Let's analyze it. Could you walk me through the time and space complexity?"
                                    }
                                  ]);
                                }, 1000);
                              }}
                            >
                              <Share2 className="h-4 w-4 mr-1" />
                              Share with Interviewer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Feedback after interview
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-xl font-medium mb-2">Interview Completed</h3>
                        <p className="text-muted-foreground">
                          Here's your performance feedback from the {interviewSettings.company} interviewer
                        </p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">Performance Metrics</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">Communication</span>
                                    <span className="text-sm font-medium">{interviewFeedback.communicationScore}/10</span>
                                  </div>
                                  <Progress value={interviewFeedback.communicationScore * 10} />
                                </div>
                                
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">Problem Solving</span>
                                    <span className="text-sm font-medium">{interviewFeedback.problemSolvingScore}/10</span>
                                  </div>
                                  <Progress value={interviewFeedback.problemSolvingScore * 10} />
                                </div>
                                
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">Code Quality</span>
                                    <span className="text-sm font-medium">{interviewFeedback.codeQualityScore}/10</span>
                                  </div>
                                  <Progress value={interviewFeedback.codeQualityScore * 10} />
                                </div>
                                
                                <div className="pt-2 border-t">
                                  <div className="flex justify-between mb-1">
                                    <span className="font-medium">Overall Score</span>
                                    <span className="font-medium">{interviewFeedback.overallScore}/10</span>
                                  </div>
                                  <Progress value={interviewFeedback.overallScore * 10} className="h-2.5" />
                                </div>
                                
                                <div className="text-center mt-4">
                                  <p className="text-muted-foreground text-sm">Time Spent: {interviewFeedback.timeSpent}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="space-y-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">Strengths</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1">
                                {interviewFeedback.strengths.map((strength, i) => (
                                  <li key={i} className="flex items-start">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                    <span>{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">Areas for Improvement</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1">
                                {interviewFeedback.improvements.map((improvement, i) => (
                                  <li key={i} className="flex items-start">
                                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                                    <span>{improvement}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Interviewer Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{interviewFeedback.suggestions}</p>
                        </CardContent>
                      </Card>
                      
                      <div className="flex justify-center gap-4 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setInterviewFeedback(null);
                            setInterviewQuestion(null);
                            setInterviewSolution("");
                            setInterviewMessages([]);
                          }}
                        >
                          New Interview
                        </Button>
                        
                        <Button
                          onClick={() => {
                            // Mark the question as completed
                            if (interviewQuestion) {
                              // In a real app, update the completed status in the database
                              alert(`Question "${interviewQuestion.title}" marked as completed!`);
                            }
                            
                            // Reset interview state
                            setInterviewFeedback(null);
                            setInterviewQuestion(null);
                            setInterviewSolution("");
                            setInterviewMessages([]);
                          }}
                        >
                          Mark Question Completed
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Role Selection Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Your Interview Goals</DialogTitle>
            <DialogDescription>
              Customize your DSA practice based on your target role, company, and salary expectations.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Target Company</Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger id="company">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Company</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Target Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Role</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="salary">Salary Level</Label>
              <Select value={selectedSalaryLevel} onValueChange={setSelectedSalaryLevel}>
                <SelectTrigger id="salary">
                  <SelectValue placeholder="Select salary level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Salary Level</SelectItem>
                  <SelectItem value="Low">Entry Level ($60K-$100K)</SelectItem>
                  <SelectItem value="Medium">Mid Level ($100K-$150K)</SelectItem>
                  <SelectItem value="High">Senior Level ($150K+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={applyRoleFilters}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Code Debugging Dialog */}
      <Dialog open={showDebugDialog} onOpenChange={setShowDebugDialog}>
        <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Debug Your Code</DialogTitle>
            <DialogDescription>
              Paste your code below and our AI will help identify issues and suggest improvements.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden">
            <div className="flex flex-col h-full">
              <Label htmlFor="code-input" className="mb-2">
                Your Code
              </Label>
              <div className="flex-1 overflow-hidden border rounded-md">
                <Textarea
                  id="code-input"
                  placeholder="Paste your code here..."
                  value={codeToDebug || sampleBuggyCode}
                  onChange={(e) => setCodeToDebug(e.target.value)}
                  className="h-full resize-none font-mono text-sm p-4"
                />
              </div>
            </div>

            <div className="flex flex-col h-full">
              <Label className="mb-2">Debug Results</Label>
              <div className="flex-1 overflow-auto border rounded-md bg-secondary/50 p-4">
                {isDebugging ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center">
                      <div className="flex space-x-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-primary animate-bounce"></div>
                        <div
                          className="w-3 h-3 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-3 h-3 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                      <p className="text-muted-foreground">Analyzing your code...</p>
                    </div>
                  </div>
                ) : debugResult ? (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                        Issues Found
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {debugResult.issues.map((issue, index) => (
                          <li key={index} className="text-sm">
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <CheckSquare className="h-5 w-5 text-green-500 mr-2" />
                        Suggested Solution
                      </h3>
                      <pre className="text-sm bg-secondary p-3 rounded-md overflow-x-auto">{debugResult.solution}</pre>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Explanation</h3>
                      <p className="text-sm">{debugResult.explanation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <div>
                      <Code className="h-10 w-10 mx-auto mb-2" />
                      <p>Click "Debug Code" to analyze your code</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCodeToDebug(sampleBuggyCode)
                setDebugResult(null)
              }}
            >
              Reset
            </Button>
            <Button onClick={handleDebugCode} disabled={isDebugging}>
              Debug Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for DSA Feature Overview */}
      <Dialog open={showFeatureOverview} onOpenChange={setShowFeatureOverview}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">DSA Interview Preparation Feature Overview</DialogTitle>
            <DialogDescription>
              Comprehensive tools to help you ace your technical interviews
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Overview</h3>
              <p>
                The DSA Interview Preparation section is a comprehensive tool designed to help users practice, 
                track progress, analyze code, create personalized study plans, and simulate technical interviews. 
                The interface is organized into 5 main tabs, each providing specialized functionality.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Main Features</h3>
              
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary">1</Badge> Practice Questions Tab
                </h4>
                <ul className="ml-6 mt-2 space-y-1 list-disc text-sm">
                  <li>
                    <span className="font-medium">Filtering System:</span> Filter by difficulty level, topics, companies, and platforms
                  </li>
                  <li>
                    <span className="font-medium">Question Display:</span> Interactive table showing completion status, favorites, and details
                  </li>
                  <li>
                    <span className="font-medium">Question Details:</span> Full problem description, action buttons, external links, and hints
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary">2</Badge> Personalized Plan Tab
                </h4>
                <ul className="ml-6 mt-2 space-y-1 list-disc text-sm">
                  <li>
                    <span className="font-medium">Goal Setting:</span> Target company, role, salary range, timeline, and experience level
                  </li>
                  <li>
                    <span className="font-medium">Plan Generation:</span> AI-generated custom study plan based on your goals
                  </li>
                  <li>
                    <span className="font-medium">Plan Management:</span> Download plan as markdown or clear existing plan
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary">3</Badge> Progress Tracking Tab
                </h4>
                <ul className="ml-6 mt-2 space-y-1 list-disc text-sm">
                  <li>
                    <span className="font-medium">Key Metrics:</span> Questions completed, completion percentage, and success rate
                  </li>
                  <li>
                    <span className="font-medium">Visual Analytics:</span> Interactive charts showing progress by difficulty and topic
                  </li>
                  <li>
                    <span className="font-medium">Recommendations:</span> AI-generated study recommendations based on your progress
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary">4</Badge> Code Analysis Tab
                </h4>
                <ul className="ml-6 mt-2 space-y-1 list-disc text-sm">
                  <li>
                    <span className="font-medium">Problem Selection:</span> Choose from available DSA problems
                  </li>
                  <li>
                    <span className="font-medium">Code Editor:</span> Write solutions in Python, Java, C++, or JavaScript
                  </li>
                  <li>
                    <span className="font-medium">Code Analysis:</span> AI-powered bug identification and optimization suggestions
                  </li>
                  <li>
                    <span className="font-medium">Solution Management:</span> Save solutions and mark problems as completed
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary">5</Badge> Mock Interview Tab
                </h4>
                <ul className="ml-6 mt-2 space-y-1 list-disc text-sm">
                  <li>
                    <span className="font-medium">Interview Configuration:</span> Company-specific style, difficulty level, and focus area
                  </li>
                  <li>
                    <span className="font-medium">Interview Simulation:</span> AI-driven mock technical interview experience
                  </li>
                  <li>
                    <span className="font-medium">Workspace:</span> Area to draft solutions during the interview
                  </li>
                  <li>
                    <span className="font-medium">Feedback:</span> Comprehensive feedback after completing the interview
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">AI Agents Integration</h3>
              <p className="mb-2">The DSA module leverages specialized AI agents:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <Badge variant="outline" className="justify-start px-3 py-1">Question Fetching Agent</Badge>
                <Badge variant="outline" className="justify-start px-3 py-1">Filtering Agent</Badge>
                <Badge variant="outline" className="justify-start px-3 py-1">Progress Tracking Agent</Badge>
                <Badge variant="outline" className="justify-start px-3 py-1">Personalization Agent</Badge>
                <Badge variant="outline" className="justify-start px-3 py-1">Debugging Agent</Badge>
                <Badge variant="outline" className="justify-start px-3 py-1">Pattern Recognition Agent</Badge>
                <Badge variant="outline" className="justify-start px-3 py-1">Interview Strategy Agent</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">User Data Management</h3>
              <p className="mb-2">The system maintains:</p>
              <ul className="ml-6 space-y-1 list-disc text-sm">
                <li>Solved questions history</li>
                <li>Code solution repository</li>
                <li>Practice patterns</li>
                <li>Favorites collection</li>
                <li>Study plans</li>
                <li>Analysis results</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowFeatureOverview(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

