package de.projekt.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VertragRepository extends JpaRepository<Vertrag, Long> {
}