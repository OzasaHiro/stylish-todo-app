'use client'

import { useState } from 'react'
import { ModeToggle } from '@/app/components/mode-toggle'
import { Button } from '@/app/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { TodoDialog } from '@/app/components/todo-dialog'
import { motion } from 'framer-motion'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="flex items-center justify-between pb-6 border-b">
      <div>
        <motion.h1 
          className="text-3xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Stylish Todo
        </motion.h1>
        <motion.p 
          className="text-muted-foreground mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Stay organized with style
        </motion.p>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button onClick={() => setIsOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </motion.div>
      </div>
      <TodoDialog open={isOpen} onOpenChange={setIsOpen} />
    </header>
  )
}
