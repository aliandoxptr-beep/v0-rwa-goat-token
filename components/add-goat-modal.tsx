"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWeb3 } from "@/contexts/web3-context"
import { useGoats } from "@/contexts/goats-context"
import { Loader2, Plus, AlertCircle, Info, Upload, ImageIcon, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

interface AddGoatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddGoatModal({ open, onOpenChange, onSuccess }: AddGoatModalProps) {
  const { isConnected, address, isCorrectNetwork, switchToMantle, networkType, getConnectedProvider } = useWeb3()
  const { addGoat } = useGoats()
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cancelled, setCancelled] = useState(false)

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    rfid: "",
    age: "",
    weight: "",
    breed: "Etawa",
    description: "",
    initialValue: "",
  })

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

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

      const newGoatId = `GOAT-${Date.now().toString().slice(-6)}`
      const newGoat = {
        nftId: newGoatId,
        rfid: formData.rfid || `RFID-${Date.now().toString().slice(-5)}`,
        name: formData.name,
        age: Number.parseInt(formData.age) || 12,
        weightHistory: [{ week: 1, weight: Number.parseFloat(formData.weight) || 20 }],
        health: "Healthy" as const,
        cost: Number.parseFloat(formData.initialValue) || 0.001,
        value: Number.parseFloat(formData.initialValue) || 0.001,
        owner: address || "0x0000...0000",
        mintDate: new Date().toISOString().split("T")[0],
        contractAddress: "0xGarosta...Contract",
        tokenId: Date.now(),
        image: photoPreview || "/goat-farm-animal.jpg",
        healthLogs: [{ date: new Date().toISOString().split("T")[0], note: "Initial health check - Healthy" }],
        feedCost: 0.0002,
        medicineCost: 0.00003,
        txHash: hash,
        breed: formData.breed,
        description: formData.description,
      }

      // Add to goats context
      addGoat(newGoat)

      setTimeout(() => {
        setIsLoading(false)
        onSuccess?.()
        onOpenChange(false)
        resetForm()
      }, 2000)
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
    setPhotoPreview(null)
    setError(null)
    setTxHash(null)
    setCancelled(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getExplorerUrl = (hash: string) => {
    return networkType === "testnet" ? `https://sepolia.mantlescan.xyz/tx/${hash}` : `https://mantlescan.xyz/tx/${hash}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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
          <div className="space-y-2">
            <Label>Goat Photo</Label>
            <div className="flex items-start gap-4">
              <div
                className="relative w-28 h-28 rounded-xl border-2 border-dashed border-border bg-muted/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {photoPreview ? (
                  <>
                    <Image src={photoPreview || "/placeholder.svg"} alt="Goat preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removePhoto()
                      }}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8 mb-1" />
                    <span className="text-xs">Add Photo</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
                <p className="text-xs text-muted-foreground">JPG, PNG or WebP. Max 5MB.</p>
              </div>
            </div>
          </div>

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
              rows={2}
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
