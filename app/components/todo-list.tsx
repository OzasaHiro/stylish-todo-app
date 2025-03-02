'use client'

import { useTodo } from '@/app/context/todo-context'
import { TodoItem } from '@/app/components/todo-item'
import { EmptyState } from '@/app/components/empty-state'
import { motion } from 'framer-motion'

export function TodoList() {
  const { todos, isLoading, error } = useTodo()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-8 p-4 bg-destructive/10 text-destructive rounded-md">
        <p>{error}</p>
      </div>
    )
  }

  if (todos.length === 0) {
    return <EmptyState />
  }

  return (
    <motion.div 
      className="space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {todos.map((todo, index) => (
        <motion.div
          key={todo.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="task-appear"
        >
          <TodoItem todo={todo} />
        </motion.div>
      ))}
    </motion.div>
  )
}
