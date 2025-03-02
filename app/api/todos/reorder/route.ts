import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function POST(request: Request) {
  try {
    const { todoId, newPosition } = await request.json()
    
    if (todoId === undefined || newPosition === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Find the current todo
    const currentTodo = await prisma.todo.findUnique({
      where: { id: todoId },
    })
    
    if (!currentTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }
    
    // Get all todos
    const allTodos = await prisma.todo.findMany({
      orderBy: { position: 'asc' },
    })
    
    // Moving from higher to lower position
    if (currentTodo.position > newPosition) {
      // Update todos between new position and old position (inclusive)
      await prisma.$transaction(
        allTodos
          .filter(t => t.position >= newPosition && t.position < currentTodo.position)
          .map(todo => 
            prisma.todo.update({
              where: { id: todo.id },
              data: { position: todo.position + 1 },
            })
          )
      )
    } 
    // Moving from lower to higher position
    else if (currentTodo.position < newPosition) {
      // Update todos between old position and new position (inclusive)
      await prisma.$transaction(
        allTodos
          .filter(t => t.position > currentTodo.position && t.position <= newPosition)
          .map(todo => 
            prisma.todo.update({
              where: { id: todo.id },
              data: { position: todo.position - 1 },
            })
          )
      )
    } else {
      // No change needed if position is the same
      return NextResponse.json({ success: true })
    }
    
    // Update the position of the current todo
    await prisma.todo.update({
      where: { id: todoId },
      data: { position: newPosition },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering todo:', error)
    return NextResponse.json(
      { error: 'Failed to reorder todo' },
      { status: 500 }
    )
  }
}
