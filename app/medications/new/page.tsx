"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewMedication() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    doseAmount: "",
    doseUnit: "mg",
    frequency: "",
    duration: "",
    durationUnit: "days",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    
    const existingMedications = JSON.parse(localStorage.getItem("medications") || "[]");
    
  
    const newMedication = {
      id: Date.now(),
      ...formData,
      startDate: new Date().toISOString(),
      status: "active",
    };
    
   
    localStorage.setItem(
      "medications",
      JSON.stringify([...existingMedications, newMedication])
    );
    
    
    router.push("/schedule");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al inicio
      </Link>

      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Registrar Nuevo Medicamento</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del medicamento</Label>
            <Input
              id="name"
              placeholder="Ej: Paracetamol"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dose">Dosis</Label>
            <div className="flex gap-4">
              <Input
                id="dose"
                type="number"
                placeholder="Cantidad"
                className="w-32"
                value={formData.doseAmount}
                onChange={(e) => setFormData({ ...formData, doseAmount: e.target.value })}
                required
              />
              <Select
                value={formData.doseUnit}
                onValueChange={(value) => setFormData({ ...formData, doseUnit: value })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mg">mg</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="pastilla">pastilla</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frecuencia</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => setFormData({ ...formData, frequency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la frecuencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">Cada 4 horas</SelectItem>
                <SelectItem value="6">Cada 6 horas</SelectItem>
                <SelectItem value="8">Cada 8 horas</SelectItem>
                <SelectItem value="12">Cada 12 horas</SelectItem>
                <SelectItem value="24">Una vez al día</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duración del tratamiento</Label>
            <div className="flex gap-4">
              <Input
                id="duration"
                type="number"
                placeholder="Duración"
                className="w-32"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
              <Select
                value={formData.durationUnit}
                onValueChange={(value) => setFormData({ ...formData, durationUnit: value })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Días</SelectItem>
                  <SelectItem value="weeks">Semanas</SelectItem>
                  <SelectItem value="months">Meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas adicionales</Label>
            <Input
              id="notes"
              placeholder="Ej: Tomar después de las comidas"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full">Guardar Medicamento</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}