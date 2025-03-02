import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { position: 'asc' },
    })
    
    return NextResponse.json(todos)
  } catch (error) {
    console.error('Error fetching todos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { title, description, priority, dueDate, category, completed } = body
    
    // Get the count of todos to set the new position
    const count = await prisma.todo.count()
    
    const newTodo = await prisma.todo.create({
      data: {
        title,
        description,
        priority: priority || 'NORMAL',
        dueDate: dueDate ? new Date(dueDate) : null,
        category,
        completed: completed || false,
        position: count, // Add at the end
      },
    })
    
    return NextResponse.json(newTodo, { status: 201 })
  } catch (error) {
    console.error('Error creating todo:', error)
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    )
  }
}
