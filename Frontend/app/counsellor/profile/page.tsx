
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Upload, Save, X, Globe, Briefcase, Award, DollarSign, MapPin, Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import ProfileSkeleton from '@/components/counsellor/profile/profle-skeleton'
import { LoadingButton } from '@/components/common/button'

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tagInput, setTagInput] = useState('');
  const [shouldUpdate, setShouldUpdate] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '', // maps to 'title' in schema
    bio: '',
    licenseNumber: '',
    yearsOfExperience: 0,
    location: '',
    sessionFee: '',
    consultationModes: [] as string[],
    expertiseTags: [] as string[],
    profileImage: ''
  })

  const consultationOptions = [
	{key:'google-meet',value:'Google Meet'}, 
	{key:'phone',value:'Phone'}, 
	{key:'in-person', value:'In Person'}]

  const handleFetchCounselorData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/counsellors/me`, {
        withCredentials: true
      })

      if (response.data.success) {
        const d = response.data.data
        // Merging User data and Counsellor data
        setFormData({
          name: d.user?.name || '',
          email: d.user?.email || '',
          title: d.title || '',
          bio: d.bio || '',
          licenseNumber: d.licenseNumber || '',
          yearsOfExperience: d.yearsOfExperience || 0,
          location: d.location || '',
          sessionFee: d.sessionFee || '',
          consultationModes: d.consultationModes || [],
          expertiseTags: d.expertiseTags || [],
          profileImage: d.user?.profileImage || ''
        })
      }
    } catch (error) {
      toast.error("Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleFetchCounselorData()
  }, [])


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShouldUpdate(true);
	const { name, value } = e.target
    setFormData({ ...formData, [name]: value });
  }

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShouldUpdate(true);
		const file = e.target.files?.[0];
		if (!file) return;

		// 1. Check file size (Base64 grows by 33%, so keep original under 1MB)
		if (file.size > 1 * 1024 * 1024) {
			toast.error("Image is too large. Please select a photo under 1MB.");
			return;
		}

		const reader = new FileReader();
		
		// 2. Start reading the file
		reader.readAsDataURL(file);

		reader.onload = () => {
			const base64String = reader.result as string;
			
			// 3. Update the state so the Avatar changes instantly
			setFormData((prev) => ({
			...prev,
			profileImage: base64String
			}));
			
			toast.success("Image uploaded to preview. Remember to save changes!");
		};

		reader.onerror = (error) => {
			console.error("Error reading file:", error);
			toast.error("Could not process image.");
		};
	};

  const handleModeChange = (mode: string) => {
	setShouldUpdate(true);
    setFormData((prev) => ({
      ...prev,
      consultationModes: prev.consultationModes.includes(mode)
        ? prev.consultationModes.filter((m) => m !== mode)
        : [...prev.consultationModes, mode],
    }))
  }

  const addTag = (e: React.KeyboardEvent) => {
	setShouldUpdate(true);
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!formData.expertiseTags.includes(tagInput.trim())) {
        setFormData({ ...formData, expertiseTags: [...formData.expertiseTags, tagInput.trim()] })
      }
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
	setShouldUpdate(true);
    setFormData({ ...formData, expertiseTags: formData.expertiseTags.filter(t => t !== tag) })
  }

  const handleSave = async () => {
	if(!shouldUpdate){
		toast.error('No Data changes to update');
		return;
	}
    setIsSaving(true)
    try {
		console.log(formData);
      await axios.put(`${process.env.NEXT_PUBLIC_API_HOST}/counsellors/me/update`, formData, {
        withCredentials: true
      })
      toast.success("Profile updated successfully");
	  setShouldUpdate(false);
    } catch (error) {
      toast.error("Error updating profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) return <ProfileSkeleton/>

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground">Manage your professional presence on MindBridge</p>
        </div>
        <div className="flex gap-3">
			<LoadingButton
				loading={isSaving}
				loadingText="Saving..."
				icon={<Save className="w-4 h-4" />}
				disabledConditions={[isSaving]}
				onClick={handleSave}
				>
				Save Changes
			</LoadingButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Avatar & Quick Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                    <AvatarImage src={formData.profileImage} />
                    <AvatarFallback className="text-2xl">{formData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Upload className="text-white h-6 w-6" />
                    <input 
					type="file" 
					className="hidden"
					accept='image/*'
					onChange={handleFileChange}
					 />
                  </label>
                </div>
                <h3 className="mt-4 font-bold text-xl">{formData.name || 'Your Name'}</h3>
                <p className="text-sm text-muted-foreground">{formData.title || 'Professional Title'}</p>
                <Badge variant="secondary" className="mt-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">
                  {formData.yearsOfExperience} Years Exp.
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Consultation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              	<div className="grid gap-4 md:grid-cols-2">
				{/* 1. EMAIL - READ ONLY */}
					<div className="space-y-2">
						<Label htmlFor="email" className="text-muted-foreground opacity-70">Email Address (Verified)</Label>
						<Input 
						id="email" 
						value={formData.email} 
						disabled 
						className="bg-muted/50 cursor-not-allowed border-dashed" 
						/>
						<p className="text-[10px] text-muted-foreground italic">Contact support to change your email.</p>
					</div>

					{/* 2. LICENSE NUMBER - READ ONLY */}
					<div className="space-y-2">
						<Label htmlFor="license" className="text-muted-foreground opacity-70">License Number (Verified)</Label>
						<Input 
						id="license" 
						value={formData.licenseNumber} 
						readOnly 
						disabled
						className="bg-muted/50 cursor-not-allowed border-dashed" 
						/>
						<p className="text-[10px] text-muted-foreground italic">License verified by MindBridge Administration.</p>
					</div>
				</div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2"><Award className="h-4 w-4" /> Professional Title</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Senior Psychotherapist" />
                </div>

				<div className="space-y-2">
					<Label htmlFor="sessionFee" className="flex items-center gap-2">
					<Briefcase className="h-4 w-4" /> Session Fee (In $)
					</Label>
					<Input 
						id="sessionFee" 
						name="sessionFee" 
						value={formData.sessionFee} 
						onChange={handleInputChange} 
					/>
				</div>
                
				<div className="space-y-2">
					<Label htmlFor="experience" className="flex items-center gap-2">
					<Briefcase className="h-4 w-4" /> Years of Experience
					</Label>
					<Input 
						id="experience" 
						name="yearsOfExperience" 
						type="number"
						value={formData.yearsOfExperience} 
						onChange={handleInputChange} 
					/>
				</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={6} placeholder="Describe your approach and clinical expertise..." />
                <p className="text-[12px] text-muted-foreground">A detailed bio helps students trust you more.</p>
              </div>

              <div className="space-y-2">
                <Label>Expertise Tags (Press Enter to add)</Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/20">
                  {formData.expertiseTags.map(tag => (
                    <button key={tag} className="leading-0 text-[10px] p-0.5 rounded-md flex items-center gap-1  bg-white border text-foreground hover:bg-white">
                      {tag}
                      <X className="h-4 w-4 cursor-pointer hover:text-red-500" onClick={() => removeTag(tag)} />
                    </button>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    className="flex-1 bg-transparent border-none outline-none text-sm min-w-30"
                    placeholder="e.g. Anxiety, Depression..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Consultation Modes</CardTitle>
              <CardDescription>Select all methods you are comfortable using.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {consultationOptions.map((mode) => (
                  <div key={mode.key} 
				  className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all cursor-pointer ${formData.consultationModes.includes(mode.key) ? 'border-emerald-500 bg-emerald-50/50' : 'border-border'}`} 
				  onClick={() => handleModeChange(mode.key)}>
                    <div className="flex flex-col items-center gap-2">
                      <Checkbox checked={formData.consultationModes.includes(mode.key)} className="sr-only" />
                      <span className={`text-sm capitalize font-semibold ${formData.consultationModes.includes(mode.key) ? 'text-emerald-700' : 'text-muted-foreground'}`}>{mode.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

