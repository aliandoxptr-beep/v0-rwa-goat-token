import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { goatsData } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ExternalLink, Copy } from "lucide-react"
import { WeightChart } from "@/components/weight-chart"

interface GoatDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function GoatDetailPage({ params }: GoatDetailPageProps) {
  const { id } = await params
  const goat = goatsData.find((g) => g.tokenId === Number.parseInt(id))

  if (!goat) {
    notFound()
  }

  const currentWeight = goat.weightHistory[goat.weightHistory.length - 1]?.weight || 0
  const initialWeight = goat.weightHistory[0]?.weight || 0
  const weightGain = currentWeight - initialWeight

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Button asChild variant="ghost" className="mb-6 -ml-2 gap-2">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1">
            <Card>
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <Image src={goat.image || "/placeholder.svg"} alt={goat.name} fill className="object-cover" />
                <div className="absolute right-3 top-3">
                  <Badge variant={goat.health === "Healthy" ? "default" : "secondary"}>{goat.health}</Badge>
                </div>
              </div>
              <CardContent className="p-5 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold">{goat.name}</h1>
                    <p className="text-muted-foreground">{goat.nftId}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-muted-foreground">Value</p>
                    <p className="text-xl font-bold text-primary">${goat.value.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-secondary p-3 text-center">
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="font-semibold mt-0.5">{goat.age} months</p>
                  </div>
                  <div className="rounded-xl bg-secondary p-3 text-center">
                    <p className="text-xs text-muted-foreground">RFID</p>
                    <p className="font-mono text-xs font-semibold mt-0.5">{goat.rfid}</p>
                  </div>
                  <div className="rounded-xl bg-secondary p-3 text-center">
                    <p className="text-xs text-muted-foreground">Current Weight</p>
                    <p className="font-semibold mt-0.5">{currentWeight} kg</p>
                  </div>
                  <div className="rounded-xl bg-secondary p-3 text-center">
                    <p className="text-xs text-muted-foreground">Weight Gain</p>
                    <p className="font-semibold text-primary mt-0.5">+{weightGain} kg</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Weight Growth Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <WeightChart data={goat.weightHistory} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Real-Time Asset Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-2 px-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Initial Weight</TableCell>
                        <TableCell className="text-right font-medium">{initialWeight} kg</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Current Weight</TableCell>
                        <TableCell className="text-right font-medium">{currentWeight} kg</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Feed Cost (Monthly)</TableCell>
                        <TableCell className="text-right font-medium">${goat.feedCost.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Medicine Cost</TableCell>
                        <TableCell className="text-right font-medium">${goat.medicineCost.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Cost</TableCell>
                        <TableCell className="text-right font-medium">${goat.cost.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Health Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {goat.healthLogs.map((log, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-border p-4">
                      <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{log.note}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{log.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  Blockchain Data
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary p-4">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">NFT Contract Address</p>
                      <p className="font-mono text-sm truncate mt-0.5">{goat.contractAddress}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary p-4">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Token ID</p>
                      <p className="font-mono text-sm mt-0.5">#{goat.tokenId}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary p-4">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Owner Address</p>
                      <p className="font-mono text-sm truncate mt-0.5">{goat.owner}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="rounded-xl bg-secondary p-4">
                    <p className="text-xs text-muted-foreground">Mint Date</p>
                    <p className="font-medium mt-0.5">{goat.mintDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
