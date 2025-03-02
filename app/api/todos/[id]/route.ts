import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

interface Params {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params
    
    const todo = await prisma.todo.findUnique({
      where: { id },
    })
    
    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(todo)
  } catch (error) {
    console.error('Error fetching todo:', error)
    return NextResponse.json(
      { error: 'Failed to fetch todo' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = params
    const body = await request.json()
    
    // Handle date conversion if it's passed
    if (body.dueDate) {
      body.dueDate = new Date(body.dueDate)
    }
    
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: body,
    })
    
    return NextResponse.json(updatedTodo)
  } catch (error) {
    console.error('Error updating todo:', error)
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params
    
    // Delete the todo
    await prisma.todo.delete({
      where: { id },
    })
    
    // Reorder remaining todos
    const remainingTodos = await prisma.todo.findMany({
      orderBy: { position: 'asc' },
    })
    
    // Update positions
    for (let i = 0; i < remainingTodos.length; i++) {
      await prisma.todo.update({
        where: { id: remainingTodos[i].id },
        data: { position: i },
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting todo:', error)
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    )
  }
}
