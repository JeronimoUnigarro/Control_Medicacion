"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, PlusCircle, Calendar, History } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Medication {
  id: number;
  name: string;
  doseAmount: string;
  doseUnit: string;
  frequency: string;
  startDate: string;
  status: string;
}

export default function Home() {
  const [activeMedications, setActiveMedications] = useState<Medication[]>([]);

  useEffect(() => {
    const medications = JSON.parse(localStorage.getItem("medications") || "[]");
    setActiveMedications(medications.filter((med: Medication) => med.status === "active"));
  }, []);

  function getNextDoseTime(medication: Medication): string {
    const startDate = new Date(medication.startDate);
    const hours = parseInt(medication.frequency);
    const now = new Date();
    
    const hoursSinceStart = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    const dosesTaken = Math.floor(hoursSinceStart / hours);
    

    const nextDose = new Date(startDate.getTime() + (dosesTaken + 1) * hours * 60 * 60 * 1000);
    

    if (nextDose < now) {
      const additionalDoses = Math.ceil((now.getTime() - nextDose.getTime()) / (hours * 60 * 60 * 1000));
      return new Date(nextDose.getTime() + additionalDoses * hours * 60 * 60 * 1000)
        .toLocaleString('es-ES', { 
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
    }
    
    return nextDose.toLocaleString('es-ES', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getFrequencyText(frequency: string): string {
    switch (frequency) {
      case "4": return "Cada 4 horas";
      case "6": return "Cada 6 horas";
      case "8": return "Cada 8 horas";
      case "12": return "Cada 12 horas";
      case "24": return "Una vez al día";
      default: return "Frecuencia no especificada";
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">MediTrack</h1>
          <p className="text-muted-foreground text-lg">
            Mantén el control de tus medicamentos de forma simple y efectiva
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <PlusCircle className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Registrar Medicamento</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Agrega tus medicamentos y configura los horarios de toma
            </p>
            <Link href="/medications/new">
              <Button className="w-full">Agregar Medicamento</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Próximas Dosis</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Visualiza y gestiona tus próximas tomas de medicamentos
            </p>
            <Link href="/schedule">
              <Button className="w-full" variant="outline">Ver Horarios</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <History className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Historial</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Revisa tu historial de medicamentos tomados
            </p>
            <Link href="/history">
              <Button className="w-full" variant="outline">Ver Historial</Button>
            </Link>
          </Card>
        </div>

        <div className="mt-12">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Medicamentos Activos</h2>
            <div className="space-y-4">
              {activeMedications.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No hay medicamentos activos.
                  <br />
                  <Link href="/medications/new">
                    <Button variant="link" className="mt-2">
                      Agregar un nuevo medicamento
                    </Button>
                  </Link>
                </div>
              ) : (
                activeMedications.map((medication) => (
                  <MedicationItem
                    key={medication.id}
                    name={medication.name}
                    nextDose={getNextDoseTime(medication)}
                    frequency={getFrequencyText(medication.frequency)}
                    dose={`${medication.doseAmount}${medication.doseUnit}`}
                  />
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

function MedicationItem({ name, nextDose, frequency, dose }: {
  name: string;
  nextDose: string;
  frequency: string;
  dose: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{frequency} - {dose}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">Próxima dosis</p>
        <p className="text-sm text-muted-foreground">{nextDose}</p>
      </div>
    </div>
  );
}