import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonButton,
} from '@ionic/angular/standalone';

import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
  ],
})
export class HomePage {
  latitude: number | null = null;
  longitude: number | null = null;
  locationEnabled: boolean = false;

  constructor(private firestore: Firestore) {}

  async getCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });

      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
      console.log('Latitude:', this.latitude);
      console.log('Longitude:', this.longitude);
    } catch (error) {
      console.error('Error getting location', error);
    }
  }

  async enableLocation() {
    this.locationEnabled = true;
    await this.getCurrentLocation();
  }

  disableLocation() {
    this.locationEnabled = false;
    this.latitude = null;
    this.longitude = null;
  }

  abrirEnGoogleMaps() {
    if (this.latitude !== null && this.longitude !== null) {
      const url = `https://www.google.com/maps?q=${this.latitude},${this.longitude}`;
      window.open(url, '_blank');
    } else {
      alert('Ubicación no disponible');
    }
  }

  async subirUbicacionAFirebase() {
    if (this.latitude === null || this.longitude === null) {
      alert('Primero debes obtener tu ubicación.');
      return;
    }

    const url = `https://www.google.com/maps?q=${this.latitude},${this.longitude}`;

    try {
      const ubicacionesRef = collection(this.firestore, 'ubicaciones');
      await addDoc(ubicacionesRef, {
        latitud: this.latitude,
        lonngitud: this.longitude,
        url: url,
        Fecha: new Date(),
        Ubicacion_De:"Isaac Quinapallo",
      });
      alert('Ubicación subida correctamente a Firebase');
    } catch (error) {
      console.error('Error al subir ubicación a Firebase:', error);
      alert('Error al subir ubicación');
    }
  }
}
