"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { financialData, goatsData } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, Wallet, DollarSign, PiggyBank, Check, Clock } from "lucide-react"
import { ExpenseChart } from "@/components/expense-chart"
import { ProfitChart } from "@/components/profit-chart"

export default function FinancialsPage() {
  const [claimStatus, setClaimStatus] = useState<"idle" | "claiming" | "claimed">("idle")

  const handleClaim = () => {
    setClaimStatus("claiming")
    setTimeout(() => {
      setClaimStatus("claimed")
    }, 2000)
  }

  const latestDividend = financialData.dividendHistory[0]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3 text-xs">
            Public Transparency
          </Badge>
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl lg:text-4xl">Financial Transparency Dashboard</h1>
          <p className="text-muted-foreground max-w-2xl">
            Complete visibility into revenue, costs, and profit distribution. Like a public company, but on-chain.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Card className="border-border">
            <CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Asset Value</p>
                <p className="text-lg sm:text-xl font-bold">${financialData.totalAssetValue.toLocaleString("en-US")}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Revenue</p>
                <p className="text-lg sm:text-xl font-bold">${financialData.totalRevenue.toLocaleString("en-US")}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Net Profit</p>
                <p className="text-lg sm:text-xl font-bold text-primary">
                  ${financialData.netProfit.toLocaleString("en-US")}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <PiggyBank className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Profit per NFT</p>
                <p className="text-lg sm:text-xl font-bold">${financialData.profitPerNFT.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Revenue & Cost Breakdown</CardTitle>
              <CardDescription>Monthly operational expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseChart expenses={financialData.expenses} />
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <span className="text-sm">Feed Cost</span>
                  <span className="font-medium">${financialData.expenses.feed.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <span className="text-sm">Medicine</span>
                  <span className="font-medium">${financialData.expenses.medicine.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <span className="text-sm">Labor</span>
                  <span className="font-medium">${financialData.expenses.labor.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <span className="text-sm">Infrastructure</span>
                  <span className="font-medium">${financialData.expenses.infrastructure.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Profit Calculation</CardTitle>
              <CardDescription>Net returns per asset</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfitChart />
              <div className="mt-6 overflow-x-auto -mx-2 px-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NFT ID</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead className="text-right">Profit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goatsData.slice(0, 4).map((goat) => (
                      <TableRow key={goat.nftId}>
                        <TableCell className="font-medium">{goat.nftId}</TableCell>
                        <TableCell>${goat.value.toFixed(2)}</TableCell>
                        <TableCell>${goat.cost.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium text-primary">
                          ${(goat.value - goat.cost).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex flex-wrap items-center gap-2">
                  Bi-Monthly Stablecoin Dividend
                  <Badge variant="secondary">USDC</Badge>
                </CardTitle>
                <CardDescription className="mt-1">
                  Automatic profit distribution to NFT holders every two months
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-medium">Available to Claim</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="mb-1 text-3xl sm:text-4xl font-bold">${latestDividend.amountPerNFT.toFixed(2)}</p>
                  <p className="mb-6 text-sm text-muted-foreground">Per NFT you own</p>
                  <Button onClick={handleClaim} disabled={claimStatus !== "idle"} className="w-full" size="lg">
                    {claimStatus === "idle" && (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        Claim Dividend
                      </>
                    )}
                    {claimStatus === "claiming" && (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    )}
                    {claimStatus === "claimed" && (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Claimed Successfully
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <div className="lg:col-span-2">
                <h4 className="mb-4 font-semibold">Distribution History</h4>
                <div className="overflow-x-auto -mx-2 px-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount per NFT</TableHead>
                        <TableHead>Total Distributed</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financialData.dividendHistory.map((dividend, i) => (
                        <TableRow key={i}>
                          <TableCell className="whitespace-nowrap">{dividend.date}</TableCell>
                          <TableCell>${dividend.amountPerNFT.toFixed(2)}</TableCell>
                          <TableCell>${dividend.totalDistributed.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={i === 0 ? "default" : "secondary"}>{i === 0 ? "Current" : "Paid"}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
