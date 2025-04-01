"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Check, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Medication {
  id: number;
  name: string;
  doseAmount: string;
  doseUnit: string;
  frequency: string;
  startDate: string;
  status: "pending" | "completed";
}

export default function Schedule() {
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    
    const storedMedications = JSON.parse(localStorage.getItem("medications") || "[]");
    
    
    const scheduleItems = storedMedications
      .filter((med: any) => med.status === "active")
      .map((med: any) => {
        const startDate = new Date(med.startDate);
        const hours = parseInt(med.frequency);
        const now = new Date();
        
        
        const hoursSinceStart = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60);
        const dosesTaken = Math.floor(hoursSinceStart / hours);
        
        
        const nextDose = new Date(startDate.getTime() + (dosesTaken + 1) * hours * 60 * 60 * 1000);

        return {
          ...med,
          nextDoseTime: nextDose,
          status: "pending"
        };
      })
      .sort((a: any, b: any) => a.nextDoseTime.getTime() - b.nextDoseTime.getTime());

    setMedications(scheduleItems);
  }, []);

  const markAsTaken = (id: number) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, status: "completed" } : med
    ));

    
    const historyEntry = {
      date: new Date().toISOString(),
      medication: medications.find(med => med.id === id),
      taken: true
    };
    
    const history = JSON.parse(localStorage.getItem("medicationHistory") || "[]");
    localStorage.setItem("medicationHistory", JSON.stringify([...history, historyEntry]));
  };

  const formatNextDose = (date: Date) => {
    return date.toLocaleString('es-ES', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold mb-8">Próximas Dosis</h1>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Próximas 24 horas
            </h2>
            <div className="space-y-4">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        med.status === "completed"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <h3 className="font-semibold">{med.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {med.doseAmount}{med.doseUnit} - {formatNextDose(med.nextDoseTime)}
                      </p>
                    </div>
                  </div>
                  {med.status === "pending" && (
                    <Button 
                      size="sm" 
                      className="flex items-center"
                      onClick={() => markAsTaken(med.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Marcar como tomado
                    </Button>
                  )}
                  {med.status === "completed" && (
                    <span className="text-sm text-green-500 font-medium">
                      Completado
                    </span>
                  )}
                </div>
              ))}
              {medications.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No hay medicamentos programados para hoy.
                  <br />
                  <Link href="/medications/new">
                    <Button variant="link" className="mt-2">
                      Agregar un nuevo medicamento
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}