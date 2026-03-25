'use client'

import { useState } from 'react'
import { Save, Bell, Lock, Mail, Globe, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import {
  FieldGroup,
  Field,
  FieldLabel,
} from '@/components/ui/field'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'MindBridge',
    supportEmail: 'support@mindbridge.com',
    emergencyHotline: '988',
    sessionDuration: '50',
    maxSessionsPerWeek: '3',
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: true,
    apiKey: 'sk_live_***',
  })

  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure platform settings and preferences</p>
      </div>

      {/* Success Message */}
      {isSaved && (
        <div className="rounded-lg border border-wellness-calm bg-wellness-soft/50 p-4 flex items-center gap-2 text-wellness-calm">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">Settings saved successfully</p>
        </div>
      )}

      {/* General Settings */}
      <Card className="border-border bg-card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">General Settings</h2>
        </div>

        <div className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Platform Name</FieldLabel>
              <Input
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                placeholder="Platform name"
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Support Email</FieldLabel>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  placeholder="support@example.com"
                />
              </div>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Emergency Hotline</FieldLabel>
              <Input
                value={settings.emergencyHotline}
                onChange={(e) => setSettings({ ...settings, emergencyHotline: e.target.value })}
                placeholder="Emergency contact number"
              />
            </Field>
          </FieldGroup>
        </div>
      </Card>

      {/* Session Settings */}
      <Card className="border-border bg-card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">Session Settings</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup>
            <Field>
              <FieldLabel>Default Session Duration (minutes)</FieldLabel>
              <Input
                type="number"
                value={settings.sessionDuration}
                onChange={(e) => setSettings({ ...settings, sessionDuration: e.target.value })}
                min="30"
                max="120"
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Max Sessions Per Week</FieldLabel>
              <Input
                type="number"
                value={settings.maxSessionsPerWeek}
                onChange={(e) => setSettings({ ...settings, maxSessionsPerWeek: e.target.value })}
                min="1"
                max="10"
              />
            </Field>
          </FieldGroup>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="border-border bg-card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">Notification Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive platform updates via email</p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive real-time push alerts</p>
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, pushNotifications: checked })
              }
            />
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="border-border bg-card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">Security Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, twoFactorAuth: checked })
              }
            />
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel>API Key</FieldLabel>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={settings.apiKey}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">API key is hidden for security</p>
            </Field>
          </FieldGroup>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
