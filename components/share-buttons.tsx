"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Facebook, Twitter, Linkedin, Mail, Copy, Check } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ShareButtonsProps {
  title: string
  description?: string
}

export default function ShareButtons({ title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareTitle = encodeURIComponent(title)
  const shareDescription = encodeURIComponent(description || "")

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: string) => {
    let shareLink = ""

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareTitle}`
        break
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case "email":
        shareLink = `mailto:?subject=${shareTitle}&body=${shareDescription}%0A%0A${encodeURIComponent(shareUrl)}`
        break
      default:
        return
    }

    window.open(shareLink, "_blank")
  }

  // Use Web Share API if available
  const canUseNativeShare = typeof navigator !== "undefined" && navigator.share

  const handleNativeShare = async () => {
    if (canUseNativeShare) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Partager:</span>

      {canUseNativeShare ? (
        <Button variant="outline" size="sm" onClick={handleNativeShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleShare("facebook")}>
              <Facebook className="h-4 w-4 mr-2 text-blue-600" />
              Facebook
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare("twitter")}>
              <Twitter className="h-4 w-4 mr-2 text-blue-400" />
              Twitter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare("linkedin")}>
              <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
              LinkedIn
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare("email")}>
              <Mail className="h-4 w-4 mr-2 text-gray-600" />
              Email
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyLink}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Lien copié!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copier le lien
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
