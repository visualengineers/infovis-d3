/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DiagrammComponent } from './diagramm.component';

describe('DiagrammComponent', () => {
  let component: DiagrammComponent;
  let fixture: ComponentFixture<DiagrammComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagrammComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagrammComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
