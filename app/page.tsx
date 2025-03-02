import { TodoList } from '@/app/components/todo-list'
import { Header } from '@/app/components/header'
import { EmptyState } from '@/app/components/empty-state'
import { TodoProvider } from '@/app/context/todo-context'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <TodoProvider>
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Header />
          <div className="mt-8">
            <TodoList />
          </div>
        </div>
      </TodoProvider>
    </main>
  )
}
