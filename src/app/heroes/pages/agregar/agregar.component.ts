import { Component, OnInit } from '@angular/core';
import { Heroe, Publisher } from '../heroe/interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})
export class AgregarComponent implements OnInit {
  constructor(private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    //this.activatedRoute.params.subscribe(id => console.log(id));
    if (this.router.url.includes('editar')) {
      this.activatedRoute.params.pipe(
        switchMap(({ id }) => this.heroesService.getHeroesPorId(id))).subscribe(heroe => this.heroe = heroe);
    } else {
      //agregando uno NUEVO
      return;
    }
  }

  publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' }
  ]

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: ''
  }

  guardar() {
    if (this.heroe.superhero.trim().length == 0) { return; }
    //console.log(this.heroe);
    //this.heroesService.agregarHeroe(this.heroe).subscribe(resp => console.log(resp));
    if (this.heroe.id) {
      // Actualizaremos el registro
      this.heroesService.actualizarHeroe(this.heroe)
        .subscribe(heroe => {
          console.log('Actualizando', heroe);
          this.mostrarSnackBar('Registro actualizado');
          this.heroe = heroe;
        })
    } else {
      // Crearemos un nuevo registro
      this.heroesService.agregarHeroe(this.heroe)
        .subscribe(heroe => {
          console.log('Agregando', heroe);
          this.mostrarSnackBar('Registro agregado');
          this.router.navigate(['/heroes/' + heroe.id]);
        })
    }

  }
  borrarHeroe() {
    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '250px',
      data: this.heroe
    });

    dialog.afterClosed().subscribe(
      (result) => {
        console.log(result); // true o undefined
        if (result) {
          this.heroesService.borrarHeroe(this.heroe.id!).subscribe(resp => {
            //console.log('Registro borrado ', this.heroe);
            this.mostrarSnackBar('Registro borrado');
            this.router.navigate(['/heroes']);
          })
        }
      }
    )
  }

  mostrarSnackBar(mensaje: string): void {
    //recibe un string y no regresa nada
    this.snackBar.open(mensaje, 'Cerrar', { duration: 2500 });
  }

}
