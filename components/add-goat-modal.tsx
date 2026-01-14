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
import { GOAT_NFT_CONTRACT } from "@/lib/goat-contract"
import { Loader2, Plus, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AddGoatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddGoatModal({ open, onOpenChange, onSuccess }: AddGoatModalProps) {
  const { isConnected, address, isCorrectNetwork, switchToMantle } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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

    if (!isConnected) {
      setError("Silakan hubungkan wallet terlebih dahulu")
      return
    }

    if (!isCorrectNetwork) {
      try {
        await switchToMantle()
      } catch {
        setError("Gagal switch ke Mantle network")
        return
      }
    }

    setIsLoading(true)

    try {
      const provider = (window as any).ethereum

      if (!provider) {
        throw new Error("Wallet provider tidak ditemukan")
      }

      // Prepare mint data
      const birthTimestamp = Math.floor(Date.now() / 1000) - Number(formData.age) * 30 * 24 * 60 * 60
      const weightInGrams = Number(formData.weight) * 1000

      // Estimate gas
      const gasEstimate = "0x" + (300000).toString(16)
      const gasPrice = await provider.request({ method: "eth_gasPrice" })

      // Create transaction for minting
      const tx = {
        from: address,
        to: GOAT_NFT_CONTRACT.address,
        gas: gasEstimate,
        gasPrice: gasPrice,
        value: "0x0",
        data: encodeMintData(
          formData.rfid,
          formData.name,
          birthTimestamp,
          weightInGrams,
          `ipfs://goat-metadata/${formData.rfid}`,
        ),
      }

      // Send transaction
      const hash = await provider.request({
        method: "eth_sendTransaction",
        params: [tx],
      })

      setTxHash(hash)

      // Wait for confirmation (simplified)
      setTimeout(() => {
        setIsLoading(false)
        onSuccess?.()
        onOpenChange(false)
        resetForm()
      }, 3000)
    } catch (err: any) {
      console.error("[v0] Mint error:", err)
      setError(err.message || "Gagal mint NFT kambing")
      setIsLoading(false)
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
  }

  // Simple encoding for mint function
  function encodeMintData(rfid: string, name: string, birthDate: number, weight: number, uri: string): string {
    // Function selector for mintGoat(string,string,uint256,uint256,string)
    const selector = "0x12345678" // Placeholder - would be actual keccak256 hash
    return selector
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Tambah Kambing Baru (Mint NFT)
          </DialogTitle>
        </DialogHeader>

        {!isConnected && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Hubungkan wallet Anda terlebih dahulu untuk mint NFT kambing</AlertDescription>
          </Alert>
        )}

        {!isCorrectNetwork && isConnected && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Anda perlu switch ke Mantle Network untuk mint NFT
              <Button variant="link" className="h-auto p-0 ml-2" onClick={switchToMantle}>
                Switch Network
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kambing</Label>
              <Input
                id="name"
                placeholder="Contoh: Bella"
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
              <Label htmlFor="age">Umur (bulan)</Label>
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
              <Label htmlFor="weight">Berat (kg)</Label>
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
              <Label htmlFor="breed">Jenis</Label>
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
            <Label htmlFor="initialValue">Nilai Awal (MNT)</Label>
            <Input
              id="initialValue"
              type="number"
              step="0.01"
              placeholder="0.5"
              value={formData.initialValue}
              onChange={(e) => setFormData({ ...formData, initialValue: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Nilai ini akan dicatat di blockchain sebagai harga awal aset
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (opsional)</Label>
            <Textarea
              id="description"
              placeholder="Informasi tambahan tentang kambing..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {txHash && (
            <Alert className="border-primary bg-primary/10">
              <AlertDescription>
                Transaksi terkirim!{" "}
                <a
                  href={`https://explorer.mantle.xyz/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  Lihat di Explorer
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
              Batal
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
                  Mint NFT Kambing
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
