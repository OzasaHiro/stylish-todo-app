'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group'
import { 
  CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Save,
  AlertCircle, 
  ArrowUp, 
  Minus
} from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { Calendar } from '@/app/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover'
import { useTodo, Todo, Priority } from '@/app/context/todo-context'
import { format } from 'date-fns'

interface TodoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  todo?: Todo
}

export function TodoDialog({ open, onOpenChange, todo }: TodoDialogProps) {
  const { addTodo, updateTodo } = useTodo()
  const [title, setTitle] = useState(todo?.title || '')
  const [description, setDescription] = useState(todo?.description || '')
  const [priority, setPriority] = useState<Priority>(todo?.priority || 'NORMAL')
  const [date, setDate] = useState<Date | undefined>(
    todo?.dueDate ? new Date(todo.dueDate) : undefined
  )
  const [category, setCategory] = useState(todo?.category || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    
    setIsSubmitting(true)
    try {
      if (todo) {
        await updateTodo(todo.id, {
          title,
          description,
          priority,
          dueDate: date,
          category: category || null,
        })
      } else {
        await addTodo({
          title,
          description,
          completed: false,
          priority,
          dueDate: date,
          category: category || null,
        })
      }
      
      // Reset form
      if (!todo) {
        setTitle('')
        setDescription('')
        setPriority('NORMAL')
        setDate(undefined)
        setCategory('')
      }
      
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting todo:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{todo ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            <DialogDescription>
              {todo ? 'Update task details' : 'Fill in the details for your new task.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="font-medium">
                Task Title
              </Label>
              <Input
                id="title"
                placeholder="Enter a task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description" className="font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Add details about your task"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 min-h-24"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-medium">Priority</Label>
                <RadioGroup 
                  value={priority} 
                  onValueChange={(value) => setPriority(value as Priority)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="LOW" id="low" />
                    <Label htmlFor="low" className="flex items-center">
                      <Minus className="h-4 w-4 mr-1 text-blue-400" />
                      Low
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NORMAL" id="normal" />
                    <Label htmlFor="normal" className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1 text-green-400" />
                      Normal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="HIGH" id="high" />
                    <Label htmlFor="high" className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1 text-yellow-500" />
                      High
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="URGENT" id="urgent" />
                    <Label htmlFor="urgent" className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                      Urgent
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <Label className="font-medium">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2 mt-2">
                  <Label htmlFor="category" className="font-medium">
                    Category
                  </Label>
                  <Input
                    id="category"
                    placeholder="Work, Personal, ..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gap-1"
              disabled={isSubmitting || !title.trim()}
            >
              <Save className="h-4 w-4" />
              {todo ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
