import { Button } from "@/components/ui/button"
import { Footer } from "./footer"
import { Navbar } from "./navbar"
import { FrownIcon } from "./ui/icons"

export function NotAvailable() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="animate-bounce">
            <FrownIcon className="w-12 h-12 text-muted" />
          </div>
          <h2 className="text-2xl font-medium text-muted">No Products Available Right Now</h2>
          <Button variant="outline" className="mt-4 opacity-0 animate-fade-in-delay-3">
            Retry
          </Button>
        </div>
      </main>
    </div>
  )
}