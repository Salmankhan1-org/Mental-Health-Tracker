'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Upload, Save } from 'lucide-react'

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: 'Dr. Sarah Smith',
    email: 'sarah.smith@mindbridgehealth.com',
    specialization: 'Clinical Psychology',
    bio: 'Experienced clinical psychologist with 8+ years of expertise in anxiety disorders, depression, and stress management for young adults.',
    sessionFee: '60',
    consultationModes: ['Google Meet', 'Phone', 'In-person'],
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleModeChange = (mode: string) => {
    setFormData((prev) => ({
      ...prev,
      consultationModes: prev.consultationModes.includes(mode)
        ? prev.consultationModes.filter((m) => m !== mode)
        : [...prev.consultationModes, mode],
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    // Show success message
  }

  const consultationOptions = ['Google Meet', 'Phone', 'In-person', 'Email']

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload or change your profile photo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" />
              <AvatarFallback>DS</AvatarFallback>
            </Avatar>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your basic profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="cursor-not-allowed bg-muted"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              placeholder="e.g., Clinical Psychology, Counselling"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself and your expertise"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fee">Session Fee (USD)</Label>
            <Input
              id="fee"
              name="sessionFee"
              type="number"
              value={formData.sessionFee}
              onChange={handleInputChange}
              placeholder="Enter session fee"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Consultation Modes</CardTitle>
          <CardDescription>Select which consultation modes you offer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {consultationOptions.map((mode) => (
            <div key={mode} className="flex items-center space-x-2">
              <Checkbox
                id={mode}
                checked={formData.consultationModes.includes(mode)}
                onCheckedChange={() => handleModeChange(mode)}
              />
              <Label htmlFor={mode} className="font-medium cursor-pointer">
                {mode}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
