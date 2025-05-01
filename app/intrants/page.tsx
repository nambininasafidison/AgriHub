import IntrantFilters from "@/components/intrant-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getIntrants } from "@/lib/actions/intrants";
import { Search } from "lucide-react";

export default async function IntrantsPage() {
  const intrants = await getIntrants();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Intrants Agricoles</h1>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Rechercher des intrants..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <IntrantFilters />
        </div>

        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {intrants.length} résultats
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Trier par:</span>
              <select className="text-sm border rounded-md p-1">
                <option>Popularité</option>
                <option>Prix: croissant</option>
                <option>Prix: décroissant</option>
                <option>Nouveautés</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Disponibilité</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {intrants.map((intrant) => (
                <TableRow key={intrant.id}>
                  <TableCell>{intrant.name}</TableCell>
                  <TableCell>
                    <Badge>{intrant.category}</Badge>
                  </TableCell>
                  <TableCell>{intrant.price} MGA</TableCell>
                  <TableCell>
                    {intrant.stock ? (
                      <span className="text-green-600">En stock</span>
                    ) : (
                      <span className="text-red-600">Rupture de stock</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      Modifier
                    </Button>
                    <Button size="sm" variant="destructive" className="ml-2">
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
