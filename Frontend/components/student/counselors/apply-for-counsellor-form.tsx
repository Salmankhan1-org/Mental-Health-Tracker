"use client"

import { useEffect, useState } from "react"
import { Loader2, Briefcase, MapPin, Tag, FileText, Clock, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { toast } from "sonner"

export function ApplyCounsellorForm() {
  const [title, setTitle] = useState("")
  const [bio, setBio] = useState("")
  const [license, setLicense] = useState("")
  const [experience, setExperience] = useState("")
  const [location, setLocation] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [virtualSessions, setVirtualSessions] = useState(false)
  const [loading, setLoading] = useState(false);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        title,
        bio,
        licenseNumber: license,
        experience,
        location,
        expertiseTags: tags,
        virtualSessions,
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/counsellors/apply`,
        payload,
        { withCredentials: true }
      )

      if (response.data.success) {
        setTitle('');
        setBio(''),
        setExperience('');
        setLicense('');
        setLocation('');
        setTags([]);
        setTagInput('');
        setVirtualSessions(false);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to submit application")
    } finally {
      setLoading(false)
    }
  }

  //Check if user Already Submitted the Application
  const handleIfAlreadyApplied = async()=>{
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/counsellors/apply/already`,{
            withCredentials: true
        })

        if(response.data.success && response.data.data.applied){
            setIsAlreadyApplied(true);
            setStatus(response.data.data.status);
        }
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(()=>{
    handleIfAlreadyApplied();
  },[]);

  if (isAlreadyApplied) {
    const statusConfig: Record<string, any> = {
        pending: {
        icon: Clock,
        title: "Application Under Review",
        color: "text-yellow-500",
        message:
            "Your counsellor application is currently being reviewed by our admin team."
        },
        approved: {
        icon: CheckCircle2,
        title: "Application Approved 🎉",
        color: "text-emerald-500",
        message:
            "Congratulations! Your counsellor account has been approved. You can now  access the counsellor dashboard.Please Logout and Login again"
        },
        rejected: {
        icon: XCircle,
        title: "Application Rejected",
        color: "text-red-500",
        message:
            "Unfortunately your application was not approved. You may update your details and apply again."
        }
    }

    const conf = statusConfig[status || "pending"]
    const Icon = conf.icon

    return (
        <div className="w-full max-w-2xl mx-auto px-4">
        <div className="rounded-xl border border-border bg-card p-6 text-center space-y-4">

            <Icon className={`mx-auto h-10 w-10 ${conf.color}`} />

            <h2 className="text-xl font-semibold text-foreground">
            {conf.title}
            </h2>

            <p className="text-sm text-muted-foreground">
            {conf.message}
            </p>

            <p className="text-xs text-muted-foreground">
            You will receive an email notification regarding your application status.
            </p>

        </div>
        </div>
    )
    }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 px-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Become a Counsellor</h1>
        <p className="text-sm text-muted-foreground">
          Share your professional details so students can connect with you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Title / Designation</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input
              placeholder="Clinical Psychologist"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Areas of Expertise</label>

          <div className="flex gap-2">
            <Input
              placeholder="Add expertise"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />

            <Button type="button" onClick={addTag}>
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Professional Bio</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
            <Textarea
              placeholder="Describe your counseling approach and experience..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="pl-10 resize-none"
              rows={4}
            />
          </div>
        </div>

        {/* License */}
        <div className="space-y-2">
          <label className="text-sm font-medium">License / Certification</label>
          <Input
            placeholder="License Number"
            value={license}
            onChange={(e) => setLicense(e.target.value)}
          />
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Years of Experience</label>
          <Input
            type="number"
            placeholder="5"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input
              placeholder="Campus Wellness Center"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Virtual Sessions */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={virtualSessions}
            onChange={(e) => setVirtualSessions(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          <span className="text-sm text-muted-foreground">
            I offer virtual counseling sessions
          </span>
        </div>

        {/* Submit */}
        <Button className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </form>
    </div>
  )
}