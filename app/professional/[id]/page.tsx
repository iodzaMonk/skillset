"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ProfessionalProfile } from "@/types/Professional";
import { getCountryName } from "@/types/Country";

const FALLBACK_IMAGE = "/no-image.svg";

async function fetchProfessionalProfile(id: string) {
  const response = await axios.get(`/api/professional/${id}`);
  return response.data as ProfessionalProfile;
}

export default function ProfessionalProfilePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    fetchProfessionalProfile(id)
      .then(setProfile)
      .catch((err) => {
        console.error("Failed to load professional profile", err);
        setError(
          axios.isAxiosError(err)
            ? (err.response?.data?.message ?? "Failed to load profile")
            : "Failed to load profile",
        );
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-text-muted text-sm">Loading profile…</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-error bg-error/10 rounded-md px-4 py-2 text-sm">
          {error ?? "Professional not found"}
        </p>
        <button
          onClick={() => router.back()}
          className="text-primary hover:text-primary/80 text-sm font-medium"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl p-6">
      <header className="border-border bg-surface/80 flex flex-col gap-4 rounded-lg border p-6 shadow">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-text text-3xl font-bold">{profile.name}</h1>
            <p className="text-text-muted text-sm">
              {profile.country
                ? `Based in ${getCountryName(profile.country) ?? profile.country}`
                : "Location unavailable"}
            </p>
            <p className="text-text-muted text-xs">{profile.email}</p>
          </div>
          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-text font-semibold">Products</p>
              <p className="text-text-muted text-sm">
                {profile.stats.totalProducts}
              </p>
            </div>
            <div>
              <p className="text-text font-semibold">Average Rating</p>
              <p className="text-text-muted text-sm">
                {profile.stats.totalRatings > 0 && profile.stats.averageRating
                  ? `${profile.stats.averageRating.toFixed(2)} (${profile.stats.totalRatings} ratings)`
                  : "No ratings yet"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-text text-xl font-semibold">Services</h2>
          <button
            onClick={() => router.back()}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Back to previous
          </button>
        </div>

        {profile.posts.length === 0 ? (
          <div className="border-border bg-surface/60 text-text-muted rounded-lg border p-6 text-center text-sm">
            This professional has not published any services yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {profile.posts.map((post) => (
              <Link
                key={post.id}
                href={`/product/${post.id}`}
                className="border-border bg-surface/70 group flex flex-col rounded-lg border shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src={post.image_url ?? FALLBACK_IMAGE}
                    alt={post.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-text line-clamp-2 text-lg font-semibold">
                      {post.title}
                    </h3>
                    <span className="text-accent text-sm font-semibold">
                      ${post.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-text-muted line-clamp-3 text-sm">
                    {post.description}
                  </p>
                  <div className="text-text-muted mt-auto flex items-center justify-between text-xs">
                    <span>
                      {new Date(post.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span>
                      {post.ratingCount && post.ratingCount > 0 && post.rating
                        ? `${post.rating.toFixed(1)} / 5 (${post.ratingCount} ratings)`
                        : "No ratings yet"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
