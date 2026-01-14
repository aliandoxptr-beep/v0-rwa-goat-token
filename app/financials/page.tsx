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
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 py-8 md:px-6 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <Badge variant="outline" className="mb-2 text-xs">
            Public Transparency
          </Badge>
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">Financial Transparency Dashboard</h1>
          <p className="text-muted-foreground">
            Complete visibility into revenue, costs, and profit distribution. Like a public company, but on-chain.
          </p>
        </div>

        {/* Key Financial Metrics */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Asset Value</p>
                <p className="text-xl font-bold">Rp {(financialData.totalAssetValue / 1000000).toFixed(1)}M</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold">Rp {(financialData.totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-xl font-bold text-primary">Rp {(financialData.netProfit / 1000000).toFixed(2)}M</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <PiggyBank className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profit per NFT</p>
                <p className="text-xl font-bold">Rp {financialData.profitPerNFT.toLocaleString("id-ID")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Revenue & Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Cost Breakdown</CardTitle>
              <CardDescription>Monthly operational expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseChart expenses={financialData.expenses} />
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <span className="text-sm">Feed Cost</span>
                  <span className="font-medium">Rp {financialData.expenses.feed.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <span className="text-sm">Medicine</span>
                  <span className="font-medium">Rp {financialData.expenses.medicine.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <span className="text-sm">Labor</span>
                  <span className="font-medium">Rp {financialData.expenses.labor.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <span className="text-sm">Infrastructure</span>
                  <span className="font-medium">
                    Rp {financialData.expenses.infrastructure.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profit Calculation */}
          <Card>
            <CardHeader>
              <CardTitle>Profit Calculation</CardTitle>
              <CardDescription>Net returns per asset</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfitChart />
              <Table className="mt-6">
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
                      <TableCell>Rp {(goat.value / 1000000).toFixed(1)}M</TableCell>
                      <TableCell>Rp {(goat.cost / 1000).toFixed(0)}K</TableCell>
                      <TableCell className="text-right font-medium text-primary">
                        Rp {((goat.value - goat.cost) / 1000000).toFixed(1)}M
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Dividend Section */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Bi-Monthly Stablecoin Dividend
                  <Badge variant="secondary">IDR-Stable Mock</Badge>
                </CardTitle>
                <CardDescription>Automatic profit distribution to NFT holders every two months</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Claim Card */}
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-medium">Available to Claim</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="mb-2 text-3xl font-bold">Rp {latestDividend.amountPerNFT.toLocaleString("id-ID")}</p>
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

              {/* Distribution History */}
              <div className="lg:col-span-2">
                <h4 className="mb-4 font-semibold">Distribution History</h4>
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
                        <TableCell>{dividend.date}</TableCell>
                        <TableCell>Rp {dividend.amountPerNFT.toLocaleString("id-ID")}</TableCell>
                        <TableCell>Rp {dividend.totalDistributed.toLocaleString("id-ID")}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={i === 0 ? "default" : "secondary"}>{i === 0 ? "Current" : "Paid"}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
