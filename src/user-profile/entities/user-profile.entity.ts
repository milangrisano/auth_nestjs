import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

 @Entity('profile')
 export class UserProfile {

    @PrimaryGeneratedColumn()
    number: number;

    @Column()
    gender: String;

    @Column()
    phone: number;

    @Column()
    estado: string;

    @Column()
    Ciudad: string;

    @Column()
    bankName: string;

    // @OneToOne(() => User)
    // @JoinColumn({name: 'id_user'})
    // user: User

 }