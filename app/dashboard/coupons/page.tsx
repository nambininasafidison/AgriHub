"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react"
import { useNotification } from "@/components/notification-provider"
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/lib/actions/coupons"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCoupon, setCurrentCoupon] = useState<any | null>(null)
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "percentage",
    value: 0,
    minPurchase: 0,
    maxDiscount: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    usageLimit: 100,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addNotification } = useNotification()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== "admin") {
      router.push("/dashboard")
      return
    }

    const loadCoupons = async () => {
      setIsLoading(true)
      try {
        const couponsData = await getCoupons()
        setCoupons(couponsData)
      } catch (error) {
        console.error("Failed to load coupons:", error)
        addNotification({
          title: "Erreur",
          message: "Impossible de charger les coupons",
          type: "error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user && user.role === "admin") {
      loadCoupons()
    }
  }, [user, router, addNotification])

  const handleAddCoupon = async () => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("code", newCoupon.code)
      formData.append("type", newCoupon.type)
      formData.append("value", newCoupon.value.toString())

      if (newCoupon.minPurchase > 0) {
        formData.append("minPurchase", newCoupon.minPurchase.toString())
      }

      if (newCoupon.type === "percentage" && newCoupon.maxDiscount > 0) {
        formData.append("maxDiscount", newCoupon.maxDiscount.toString())
      }

      formData.append("startDate", newCoupon.startDate)
      formData.append("endDate", newCoupon.endDate)
      formData.append("usageLimit", newCoupon.usageLimit.toString())

      const result = await createCoupon(formData)

      if (result.error) {
        addNotification({
          title: "Erreur",
          message: result.error,
          type: "error",
        })
      } else {
        addNotification({
          title: "Coupon créé",
          message: `Le coupon ${newCoupon.code} a été créé avec succès`,
          type: "success",
        })

        setCoupons([...coupons, result.coupon])
        setNewCoupon({
          code: "",
          type: "percentage",
          value: 0,
          minPurchase: 0,
          maxDiscount: 0,
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          usageLimit: 100,
        })
        setIsAddDialogOpen(false)
      }
    } catch (error) {
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue lors de la création du coupon",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCoupon = async () => {
    if (!currentCoupon) return
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("couponId", currentCoupon.id)
      formData.append("code", currentCoupon.code)
      formData.append("type", currentCoupon.type)
      formData.append("value", currentCoupon.value.toString())

      if (currentCoupon.minPurchase > 0) {
        formData.append("minPurchase", currentCoupon.minPurchase.toString())
      }

      if (currentCoupon.type === "percentage" && currentCoupon.maxDiscount > 0) {
        formData.append("maxDiscount", currentCoupon.maxDiscount.toString())
      }

      formData.append("startDate", currentCoupon.startDate)
      formData.append("endDate", currentCoupon.endDate)
      formData.append("usageLimit", currentCoupon.usageLimit.toString())

      const result = await updateCoupon(formData)

      if (result.error) {
        addNotification({
          title: "Erreur",
          message: result.error,
          type: "error",
        })
      } else {
        addNotification({
          title: "Coupon mis à jour",
          message: `Le coupon ${currentCoupon.code} a été mis à jour avec succès`,
          type: "success",
        })

        setCoupons(coupons.map((c) => (c.id === currentCoupon.id ? result.coupon : c)))
        setIsEditDialogOpen(false)
      }
    } catch (error) {
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue lors de la mise à jour du coupon",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCoupon = async () => {
    if (!currentCoupon) return
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("couponId", currentCoupon.id)

      const result = await deleteCoupon(formData)

      if (result.error) {
        addNotification({
          title: "Erreur",
          message: result.error,
          type: "error",
        })
      } else {
        addNotification({
          title: "Coupon supprimé",
          message: `Le coupon ${currentCoupon.code} a été supprimé avec succès`,
          type: "success",
        })

        setCoupons(coupons.filter((c) => c.id !== currentCoupon.id))
        setIsDeleteDialogOpen(false)
      }
    } catch (error) {
      addNotification({
        title: "Erreur",
        message: "Une erreur est survenue lors de la suppression du coupon",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des coupons</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Créer un coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un nouveau coupon</DialogTitle>
              <DialogDescription>Créez un nouveau code de réduction pour vos clients.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="ex: WELCOME10"
                  className="uppercase"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type de réduction</Label>
                <Select
                  value={newCoupon.type}
                  onValueChange={(value) => setNewCoupon({ ...newCoupon, type: value as "percentage" | "fixed" })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                    <SelectItem value="fixed">Montant fixe (Ar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">
                  {newCoupon.type === "percentage" ? "Pourcentage de réduction" : "Montant de réduction (Ar)"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                  min={0}
                  max={newCoupon.type === "percentage" ? 100 : undefined}
                  required
                />
              </div>

              {newCoupon.type === "percentage" && (
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">Réduction maximale (Ar)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    value={newCoupon.maxDiscount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) })}
                    min={0}
                    placeholder="Optionnel"
                  />
                  <p className="text-xs text-gray-500">Laissez vide pour aucune limite</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="minPurchase">Achat minimum (Ar)</Label>
                <Input
                  id="minPurchase"
                  type="number"
                  value={newCoupon.minPurchase}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: Number(e.target.value) })}
                  min={0}
                  placeholder="Optionnel"
                />
                <p className="text-xs text-gray-500">Laissez 0 pour aucun minimum</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Date de début</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newCoupon.startDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, startDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Date de fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newCoupon.endDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageLimit">Limite d'utilisation</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={newCoupon.usageLimit}
                  onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: Number(e.target.value) })}
                  min={0}
                  placeholder="Optionnel"
                />
                <p className="text-xs text-gray-500">Laissez 0 pour aucune limite</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddCoupon} disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer le coupon"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Valeur</TableHead>
                <TableHead>Achat min.</TableHead>
                <TableHead>Validité</TableHead>
                <TableHead>Utilisations</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Aucun coupon trouvé. Créez votre premier coupon !
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-medium">{coupon.code}</TableCell>
                    <TableCell>{coupon.type === "percentage" ? "Pourcentage" : "Montant fixe"}</TableCell>
                    <TableCell>
                      {coupon.type === "percentage"
                        ? `${coupon.value}%${coupon.maxDiscount ? ` (max ${coupon.maxDiscount.toLocaleString()} Ar)` : ""}`
                        : `${coupon.value.toLocaleString()} Ar`}
                    </TableCell>
                    <TableCell>{coupon.minPurchase ? `${coupon.minPurchase.toLocaleString()} Ar` : "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          new Date(coupon.endDate) < new Date()
                            ? "bg-red-100 text-red-800"
                            : new Date(coupon.startDate) > new Date()
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {new Date(coupon.endDate) < new Date()
                          ? "Expiré"
                          : new Date(coupon.startDate) > new Date()
                            ? "À venir"
                            : "Actif"}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(coupon.startDate).toLocaleDateString()} -{" "}
                        {new Date(coupon.endDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {coupon.usageLimit ? `${coupon.usageCount}/${coupon.usageLimit}` : coupon.usageCount}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog
                          open={isEditDialogOpen && currentCoupon?.id === coupon.id}
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open)
                            if (!open) setCurrentCoupon(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setCurrentCoupon(coupon)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Modifier le coupon</DialogTitle>
                              <DialogDescription>Modifiez les détails du coupon {coupon.code}.</DialogDescription>
                            </DialogHeader>
                            {currentCoupon && (
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-code">Code</Label>
                                  <Input
                                    id="edit-code"
                                    value={currentCoupon.code}
                                    onChange={(e) =>
                                      setCurrentCoupon({ ...currentCoupon, code: e.target.value.toUpperCase() })
                                    }
                                    className="uppercase"
                                    required
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-type">Type de réduction</Label>
                                  <Select
                                    value={currentCoupon.type}
                                    onValueChange={(value) =>
                                      setCurrentCoupon({ ...currentCoupon, type: value as "percentage" | "fixed" })
                                    }
                                  >
                                    <SelectTrigger id="edit-type">
                                      <SelectValue placeholder="Sélectionnez un type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                                      <SelectItem value="fixed">Montant fixe (Ar)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-value">
                                    {currentCoupon.type === "percentage"
                                      ? "Pourcentage de réduction"
                                      : "Montant de réduction (Ar)"}
                                  </Label>
                                  <Input
                                    id="edit-value"
                                    type="number"
                                    value={currentCoupon.value}
                                    onChange={(e) =>
                                      setCurrentCoupon({ ...currentCoupon, value: Number(e.target.value) })
                                    }
                                    min={0}
                                    max={currentCoupon.type === "percentage" ? 100 : undefined}
                                    required
                                  />
                                </div>

                                {currentCoupon.type === "percentage" && (
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-maxDiscount">Réduction maximale (Ar)</Label>
                                    <Input
                                      id="edit-maxDiscount"
                                      type="number"
                                      value={currentCoupon.maxDiscount || ""}
                                      onChange={(e) =>
                                        setCurrentCoupon({ ...currentCoupon, maxDiscount: Number(e.target.value) || 0 })
                                      }
                                      min={0}
                                      placeholder="Optionnel"
                                    />
                                    <p className="text-xs text-gray-500">Laissez vide pour aucune limite</p>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <Label htmlFor="edit-minPurchase">Achat minimum (Ar)</Label>
                                  <Input
                                    id="edit-minPurchase"
                                    type="number"
                                    value={currentCoupon.minPurchase || ""}
                                    onChange={(e) =>
                                      setCurrentCoupon({ ...currentCoupon, minPurchase: Number(e.target.value) || 0 })
                                    }
                                    min={0}
                                    placeholder="Optionnel"
                                  />
                                  <p className="text-xs text-gray-500">Laissez 0 pour aucun minimum</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-startDate">Date de début</Label>
                                    <Input
                                      id="edit-startDate"
                                      type="date"
                                      value={currentCoupon.startDate.split("T")[0]}
                                      onChange={(e) =>
                                        setCurrentCoupon({ ...currentCoupon, startDate: e.target.value })
                                      }
                                      required
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="edit-endDate">Date de fin</Label>
                                    <Input
                                      id="edit-endDate"
                                      type="date"
                                      value={currentCoupon.endDate.split("T")[0]}
                                      onChange={(e) => setCurrentCoupon({ ...currentCoupon, endDate: e.target.value })}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-usageLimit">Limite d'utilisation</Label>
                                  <Input
                                    id="edit-usageLimit"
                                    type="number"
                                    value={currentCoupon.usageLimit || ""}
                                    onChange={(e) =>
                                      setCurrentCoupon({ ...currentCoupon, usageLimit: Number(e.target.value) || 0 })
                                    }
                                    min={0}
                                    placeholder="Optionnel"
                                  />
                                  <p className="text-xs text-gray-500">Laissez 0 pour aucune limite</p>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Annuler
                              </Button>
                              <Button onClick={handleEditCoupon} disabled={isSubmitting}>
                                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog
                          open={isDeleteDialogOpen && currentCoupon?.id === coupon.id}
                          onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open)
                            if (!open) setCurrentCoupon(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setCurrentCoupon(coupon)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Supprimer le coupon</DialogTitle>
                              <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer ce coupon ? Cette action est irréversible.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="flex items-center p-4 bg-red-50 rounded-md">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                <p className="text-sm text-red-500">
                                  Cette action supprimera définitivement le coupon "{coupon.code}".
                                </p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Annuler
                              </Button>
                              <Button variant="destructive" onClick={handleDeleteCoupon} disabled={isSubmitting}>
                                {isSubmitting ? "Suppression..." : "Supprimer"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
