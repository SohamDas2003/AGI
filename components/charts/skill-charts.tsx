"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

export function SkillRadar({ data }: { data: { area: string; avg: number }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid stroke={"hsl(var(--border))"} />
          <PolarAngleAxis dataKey="area" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 5]}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            stroke={"hsl(var(--border))"}
          />
          <Radar
            name="Average"
            dataKey="avg"
            stroke={"hsl(var(--primary))"}
            fill={"hsl(var(--primary))"}
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SkillBars({ data }: { data: { area: string; avg: number }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke={"hsl(var(--border))"} strokeDasharray="3 3" />
          <XAxis dataKey="area" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis domain={[0, 5]} tick={{ fill: "hsl(var(--muted-foreground))" }} stroke={"hsl(var(--border))"} />
          <Tooltip />
          <Bar dataKey="avg" fill={"hsl(var(--primary))"} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
