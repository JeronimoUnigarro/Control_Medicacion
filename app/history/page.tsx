"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Calendar, Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface MedicationHistory {
  date: string;
  medications: {
    name: string;
    doseAmount: string;
    doseUnit: string;
    time: string;
    taken: boolean;
  }[];
}

export default function History() {
  const [historyData, setHistoryData] = useState<MedicationHistory[]>([]);
  const [period, setPeriod] = useState("week");

  useEffect(() => {
    
    const history = JSON.parse(localStorage.getItem("medicationHistory") || "[]");
    
    
    const groupedHistory = history.reduce((acc: any, entry: any) => {
      const date = new Date(entry.date).toISOString().split('T')[0];
      
      if (!acc[date]) {
        acc[date] = {
          date,
          medications: []
        };
      }
      
      acc[date].medications.push({
        name: entry.medication.name,
        doseAmount: entry.medication.doseAmount,
        doseUnit: entry.medication.doseUnit,
        time: new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        taken: entry.taken
      });
      
      return acc;
    }, {});

    
    const sortedHistory = Object.values(groupedHistory)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setHistoryData(sortedHistory as MedicationHistory[]);

  }, []);

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

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Historial de Medicación</h1>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
              <SelectItem value="year">Último año</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {historyData.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              <p>No hay historial de medicamentos disponible.</p>
              <Link href="/medications/new">
                <Button variant="link" className="mt-2">
                  Comenzar a registrar medicamentos
                </Button>
              </Link>
            </Card>
          ) : (
            historyData.map((day, index) => (
              <Card key={index} className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {new Date(day.date).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <div className="space-y-4">
                  {day.medications.map((med, medIndex) => (
                    <div
                      key={medIndex}
                      className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        {med.taken ? (
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold">{med.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {med.doseAmount}{med.doseUnit} - {med.time}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          med.taken ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {med.taken ? "Tomado" : "No tomado"}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}