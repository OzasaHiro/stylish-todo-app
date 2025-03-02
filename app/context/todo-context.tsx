'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useToast } from '@/app/components/ui/use-toast'

export type Todo = {
  id: string
  title: string
  description?: string | null
  completed: boolean
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  category?: string | null
  dueDate?: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
  position: number
}

type TodoContextType = {
  todos: Todo[]
  isLoading: boolean
  error: string | null
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'position'>) => Promise<void>
  updateTodo: (id: string, data: Partial<Todo>) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  toggleComplete: (id: string) => Promise<void>
  reorderTodos: (startIndex: number, endIndex: number) => Promise<void>
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchTodos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/todos')
      if (!response.ok) {
        throw new Error('Failed to fetch todos')
      }
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
      setError('Failed to load todos. Please try again.')
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load todos. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const addTodo = async (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'position'>) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      })

      if (!response.ok) {
        throw new Error('Failed to add todo')
      }

      const newTodo = await response.json()
      setTodos(prev => [...prev, newTodo])
      toast({
        title: 'Success',
        description: 'Todo added successfully',
      })
    } catch (error) {
      console.error('Error adding todo:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add todo. Please try again.',
      })
    }
  }

  const updateTodo = async (id: string, data: Partial<Todo>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update todo')
      }

      const updatedTodo = await response.json()
      setTodos(prev => prev.map(todo => (todo.id === id ? updatedTodo : todo)))
      toast({
        title: 'Success',
        description: 'Todo updated successfully',
      })
    } catch (error) {
      console.error('Error updating todo:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update todo. Please try again.',
      })
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete todo')
      }

      setTodos(prev => prev.filter(todo => todo.id !== id))
      toast({
        title: 'Success',
        description: 'Todo deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting todo:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete todo. Please try again.',
      })
    }
  }

  const toggleComplete = async (id: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    await updateTodo(id, { completed: !todo.completed })
  }

  const reorderTodos = async (startIndex: number, endIndex: number) => {
    // Optimistically update UI
    const newTodos = Array.from(todos)
    const [removed] = newTodos.splice(startIndex, 1)
    newTodos.splice(endIndex, 0, removed)
    
    // Update positions
    const updatedTodos = newTodos.map((todo, index) => ({
      ...todo,
      position: index,
    }))
    
    setTodos(updatedTodos)
    
    // Send to backend
    try {
      const response = await fetch('/api/todos/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todoId: removed.id,
          newPosition: endIndex,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to reorder todos')
      }
    } catch (error) {
      console.error('Error reordering todos:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reorder todos. Please refresh the page.',
      })
      fetchTodos() // Revert to server state
    }
  }

  return (
    <TodoContext.Provider
      value={{
        todos,
        isLoading,
        error,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        reorderTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

export function useTodo() {
  const context = useContext(TodoContext)
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider')
  }
  return context
}
