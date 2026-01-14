"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWeb3 } from "@/contexts/web3-context"
import { Loader2, Plus, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AddGoatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddGoatModal({ open, onOpenChange, onSuccess }: AddGoatModalProps) {
  const { isConnected, address, isCorrectNetwork, switchToMantle, networkType, getConnectedProvider } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cancelled, setCancelled] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    rfid: "",
    age: "",
    weight: "",
    breed: "Etawa",
    description: "",
    initialValue: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setTxHash(null)
    setCancelled(false)

    if (!isConnected) {
      setError("Please connect your wallet first")
      return
    }

    if (!isCorrectNetwork) {
      try {
        await switchToMantle()
      } catch {
        setError("Failed to switch to Mantle network")
        return
      }
    }

    setIsLoading(true)

    try {
      const provider = getConnectedProvider()

      if (!provider) {
        throw new Error("Wallet provider not found. Please reconnect your wallet.")
      }

      const treasuryAddress = "0x48e390cf960497142e6724637e5edd288ea911f2"
      const mintFee = formData.initialValue || "0.001"
      const valueInWei = BigInt(Math.floor(Number.parseFloat(mintFee) * 1e18))

      const tx = {
        from: address,
        to: treasuryAddress,
        value: "0x" + valueInWei.toString(16),
      }

      const hash = await provider.request({
        method: "eth_sendTransaction",
        params: [tx],
      })

      setTxHash(hash)

      setTimeout(() => {
        setIsLoading(false)
        onSuccess?.()
        onOpenChange(false)
        resetForm()
      }, 3000)
    } catch (err: any) {
      console.error("[v0] Mint error:", err.message)
      setIsLoading(false)

      if (err.code === 4001 || err.message?.includes("User denied") || err.message?.includes("user rejected")) {
        setCancelled(true)
        return
      }

      setError(err.message || "Failed to mint goat NFT")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      rfid: "",
      age: "",
      weight: "",
      breed: "Etawa",
      description: "",
      initialValue: "",
    })
    setError(null)
    setTxHash(null)
    setCancelled(false)
  }

  const getExplorerUrl = (hash: string) => {
    return networkType === "testnet" ? `https://sepolia.mantlescan.xyz/tx/${hash}` : `https://mantlescan.xyz/tx/${hash}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Goat (Mint NFT)
          </DialogTitle>
        </DialogHeader>

        {!isConnected && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Connect your wallet first to mint a goat NFT</AlertDescription>
          </Alert>
        )}

        {!isCorrectNetwork && isConnected && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to switch to Mantle Network to mint NFT
              <Button variant="link" className="h-auto p-0 ml-2" onClick={switchToMantle}>
                Switch Network
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Goat Name</Label>
              <Input
                id="name"
                placeholder="e.g. Bella"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rfid">RFID Tag</Label>
              <Input
                id="rfid"
                placeholder="RFID-XXXXX"
                value={formData.rfid}
                onChange={(e) => setFormData({ ...formData, rfid: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age (months)</Label>
              <Input
                id="age"
                type="number"
                placeholder="12"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="25"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Select value={formData.breed} onValueChange={(value) => setFormData({ ...formData, breed: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Etawa">Etawa</SelectItem>
                  <SelectItem value="Kacang">Kacang</SelectItem>
                  <SelectItem value="Boer">Boer</SelectItem>
                  <SelectItem value="Saanen">Saanen</SelectItem>
                  <SelectItem value="Jawarandu">Jawarandu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialValue">Initial Value (MNT)</Label>
            <Input
              id="initialValue"
              type="number"
              step="0.0001"
              placeholder="0.001"
              value={formData.initialValue}
              onChange={(e) => setFormData({ ...formData, initialValue: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              This value will be recorded on blockchain as the initial asset price (recommended: 0.001 MNT for testnet)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional information about the goat..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {cancelled && (
            <Alert className="border-yellow-500 bg-yellow-500/10">
              <Info className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                Transaction cancelled. Click &quot;Mint Goat NFT&quot; to try again.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {txHash && (
            <Alert className="border-primary bg-primary/10">
              <AlertDescription>
                Transaction submitted!{" "}
                <a
                  href={getExplorerUrl(txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  View on Explorer
                </a>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!isConnected || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Minting...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Mint Goat NFT
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
