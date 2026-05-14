$content = Get-Content 'components/cat-ai-chat-interface.tsx' -Raw
$content = $content -replace "import { Terminal, Sparkles, BookOpen, BarChart2, Calculator, MessageSquare, Target, TrendingUp, Brain, Plus, ArrowLeft, ChevronRight } from 'lucide-react'\n", "`$&import ReactMarkdown from 'react-markdown'\n"
$content | Set-Content 'components/cat-ai-chat-interface.tsx' -NoNewline
Write-Host "Import added successfully"