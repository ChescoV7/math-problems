"use client"

import { useState, useMemo } from "react"
import { Search, Gamepad2, Star, Clock, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const games = [
  { name: "1v1.lol", path: "1on1l0l/index.html", category: "Action", featured: true },
  { name: "Among Us", path: "among-us/index.html", category: "Social", featured: true },
  { name: "Minecraft", path: "minecraft/index.html", category: "Sandbox", featured: true },
  { name: "2048", path: "2048/index.html", category: "Puzzle", featured: false },
  { name: "Flappy Bird", path: "flappy-bird/index.html", category: "Arcade", featured: false },
  { name: "Cookie Clicker", path: "cookie-clicker/index.html", category: "Idle", featured: true },
  { name: "Geometry Dash", path: "geometrydash/index.html", category: "Platformer", featured: false },
  { name: "Happy Wheels", path: "happy-wheels/index.html", category: "Action", featured: true },
  { name: "Run 3", path: "run-3/index.html", category: "Platformer", featured: false },
  { name: "Slope", path: "slope/index.html", category: "Arcade", featured: false },
  { name: "Snake", path: "snake/index.html", category: "Arcade", featured: false },
  { name: "Tetris", path: "tetris/index.html", category: "Puzzle", featured: false },
  { name: "Chrome Dino", path: "chrome-dino/index.html", category: "Arcade", featured: false },
  { name: "Pac-Man", path: "pacman/index.html", category: "Arcade", featured: false },
  { name: "Super Mario", path: "mario/index.html", category: "Platformer", featured: true },
  { name: "Subway Surfers", path: "subway-surfers/index.html", category: "Endless", featured: true },
  { name: "Basketball Stars", path: "basketball-stars/index.html", category: "Sports", featured: false },
  { name: "Krunker", path: "krunker/index.html", category: "Shooter", featured: false },
  { name: "Shell Shockers", path: "shell-shockers/index.html", category: "Shooter", featured: false },
  { name: "Wordle", path: "wordle/index.html", category: "Word", featured: false },
  { name: "Doodle Jump", path: "doodle-jump/index.html", category: "Arcade", featured: false },
  { name: "Temple Run 2", path: "temple-run-2/index.html", category: "Endless", featured: false },
  { name: "Angry Birds", path: "angry-birds/index.html", category: "Puzzle", featured: false },
  { name: "Cut the Rope", path: "cuttherope/index.html", category: "Puzzle", featured: false },
  { name: "Fruit Ninja", path: "fruitninja/index.html", category: "Arcade", featured: false },
  { name: "Plants vs Zombies 2", path: "pvz-2/index.html", category: "Strategy", featured: false },
  { name: "Duck Life", path: "ducklife/index.html", category: "Adventure", featured: false },
  { name: "Getting Over It", path: "getting-over-it/index.html", category: "Platformer", featured: false },
  { name: "Friday Night Funkin", path: "fridaynightfunkin/index.html", category: "Rhythm", featured: false },
  { name: "Retro Bowl", path: "retro-bowl/index.html", category: "Sports", featured: false },
]

const categories = [
  "All",
  "Action",
  "Arcade",
  "Puzzle",
  "Platformer",
  "Sports",
  "Strategy",
  "Shooter",
  "Social",
  "Sandbox",
  "Idle",
  "Endless",
  "Word",
  "Rhythm",
  "Adventure",
]

export default function GameWebsite() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || game.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const featuredGames = games.filter((game) => game.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Gamepad2 className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">GameHub</h1>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {games.length} Games
            </Badge>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Games */}
        {searchTerm === "" && selectedCategory === "All" && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Featured Games</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {featuredGames.map((game) => (
                <a
                  key={game.path}
                  href={game.path}
                  className="group relative bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Gamepad2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {game.name}
                      </h3>
                      <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-300">
                        {game.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Browse by Category</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Games Grid */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-green-400" />
            <h2 className="text-xl font-bold text-white">
              {searchTerm || selectedCategory !== "All" ? "Search Results" : "All Games"}
            </h2>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              {filteredGames.length} games
            </Badge>
          </div>

          {filteredGames.length === 0 ? (
            <div className="text-center py-12">
              <Gamepad2 className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No games found</h3>
              <p className="text-gray-500">Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredGames.map((game) => (
                <a
                  key={game.path}
                  href={game.path}
                  className="group bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/10"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md flex items-center justify-center flex-shrink-0">
                      <Gamepad2 className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-white group-hover:text-blue-300 transition-colors truncate">
                        {game.name}
                      </h3>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-gray-600 text-gray-400 group-hover:border-blue-400 group-hover:text-blue-300 transition-colors"
                  >
                    {game.category}
                  </Badge>
                  {game.featured && (
                    <div className="absolute top-2 right-2">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    </div>
                  )}
                </a>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gamepad2 className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold text-white">GameHub</span>
            </div>
            <p className="text-gray-400">
              Your ultimate destination for browser games. Play instantly, no downloads required!
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
