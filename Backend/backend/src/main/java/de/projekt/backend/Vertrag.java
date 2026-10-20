package de.projekt.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Vertrag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titel;
    private String partner;
    private double wert;

    // Leerer Konstruktor (für JPA)
    public Vertrag() {}

    public Vertrag(String titel, String partner, double wert) {
        this.titel = titel;
        this.partner = partner;
        this.wert = wert;
    }

    // Getter & Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitel() { return titel; }
    public void setTitel(String titel) { this.titel = titel; }

    public String getPartner() { return partner; }
    public void setPartner(String partner) { this.partner = partner; }

    public double getWert() { return wert; }
    public void setWert(double wert) { this.wert = wert; }
}