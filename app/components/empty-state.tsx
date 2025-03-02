'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { PlusCircle, ListChecks } from 'lucide-react'
import { TodoDialog } from '@/app/components/todo-dialog'
import { motion } from 'framer-motion'

export function EmptyState() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div 
      className="empty-state flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 my-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <ListChecks className="h-16 w-16 text-muted-foreground mb-4 animate-bounce-light" />
      </motion.div>
      
      <motion.h3 
        className="text-lg font-medium mb-2"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        No tasks yet
      </motion.h3>
      
      <motion.p 
        className="text-muted-foreground text-center mb-6"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Create your first task to get started with your stylish TODO list.
      </motion.p>
      
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Button onClick={() => setIsOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Your First Task
        </Button>
      </motion.div>
      
      <TodoDialog open={isOpen} onOpenChange={setIsOpen} />
    </motion.div>
  )
}
