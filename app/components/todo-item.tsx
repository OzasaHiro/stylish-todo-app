'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Checkbox } from '@/app/components/ui/checkbox'
import { Button } from '@/app/components/ui/button'
import { Pencil, Trash2, Calendar, Tag } from 'lucide-react'
import { useTodo, Todo } from '@/app/context/todo-context'
import { TodoDialog } from '@/app/components/todo-dialog'
import { formatDate, getPriorityColor } from '@/app/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/components/ui/alert-dialog'

interface TodoItemProps {
  todo: Todo
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleComplete, deleteTodo } = useTodo()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  const handleToggleComplete = () => {
    toggleComplete(todo.id)
  }
  
  const handleDelete = async () => {
    await deleteTodo(todo.id)
    setIsDeleteOpen(false)
  }
  
  return (
    <>
      <motion.div 
        layout
        className={`relative flex items-start gap-3 p-4 rounded-lg border ${todo.completed ? 'task-complete' : ''} hover:bg-accent/30`}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <div className={`priority-indicator ${getPriorityColor(todo.priority)}`} />
        
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggleComplete}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-medium text-base ${todo.completed ? 'line-through opacity-70' : ''}`}>
              {todo.title}
            </h3>
            
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsEditOpen(true)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              
              <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>確認</AlertDialogTitle>
                    <AlertDialogDescription>
                      このタスクを削除してもよろしいですか？この操作は元に戻せません。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      削除
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          {todo.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {todo.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
            {todo.dueDate && (
              <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(todo.dueDate)}</span>
              </div>
            )}
            
            {todo.category && (
              <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full">
                <Tag className="h-3 w-3" />
                <span>{todo.category}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      <TodoDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        todo={todo} 
      />
    </>
  )
}
