import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation | AgriHub",
  description: "API documentation for the AgriHub platform",
};

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>

      <Tabs defaultValue="auth">
        <TabsList className="mb-6">
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="cart">Cart</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="auth">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>POST /api/auth/register</CardTitle>
                <CardDescription>Register a new user</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Request Body</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                  {`{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "buyer" | "farmer" | "supplier"
}`}
                </pre>

                <h3 className="font-semibold mt-4 mb-2">Response</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                  {`{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>POST /api/auth/login</CardTitle>
                <CardDescription>Login a user</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Request Body</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                  {`{
  "email": "string",
  "password": "string"
}`}
                </pre>

                <h3 className="font-semibold mt-4 mb-2">Response</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                  {`{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GET /api/auth/logout</CardTitle>
                <CardDescription>Logout a user</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Response</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                  {`{
  "success": true
}`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>GET /api/products</CardTitle>
                <CardDescription>
                  Get all products with filtering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Query Parameters</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <code>category</code> - Filter by category
                  </li>
                  <li>
                    <code>subcategory</code> - Filter by subcategory
                  </li>
                  <li>
                    <code>region</code> - Filter by region
                  </li>
                  <li>
                    <code>minPrice</code> - Minimum price
                  </li>
                  <li>
                    <code>maxPrice</code> - Maximum price
                  </li>
                  <li>
                    <code>sortBy</code> - Sort by (price_asc, price_desc,
                    rating, newest)
                  </li>
                  <li>
                    <code>featured</code> - Filter featured products
                    (true/false)
                  </li>
                  <li>
                    <code>search</code> - Search term
                  </li>
                  <li>
                    <code>page</code> - Page number
                  </li>
                  <li>
                    <code>limit</code> - Items per page
                  </li>
                </ul>

                <h3 className="font-semibold mt-4 mb-2">Response</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                  {`{
  "products": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": number,
      "category": "string",
      "subcategory": "string",
      "region": "string",
      "seller": "string",
      "sellerId": "string",
      "stock": number,
      "rating": number,
      "reviewCount": number,
      "image": "string",
      "images": ["string"],
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "pages": number
  }
}`}
                </pre>
              </CardContent>
            </Card>

            {/* More product endpoints... */}
          </div>
        </TabsContent>

        {/* More tabs... */}
      </Tabs>
    </div>
  );
}
