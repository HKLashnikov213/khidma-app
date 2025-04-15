// frontend/src/components/Auth/AuthForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import './AuthForm.css';

// === Validation Schemas ===
const phoneSchema = z.object({
  phone: z.string().min(10, 'Numéro invalide').regex(/^0[567]/, 'Format DZ invalide'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'Code OTP à 6 chiffres'),
});

/**
 * Composant AuthForm
 * Étape 1 : Entrée numéro de téléphone
 * Étape 2 : Vérification du code OTP
 * @returns {JSX.Element}
 */
const AuthForm = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Formulaires RHF
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step === 1 ? phoneSchema : otpSchema),
  });

  // Mutation : envoyer OTP
  const sendOtpMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: data.phone }),
      });
      if (!res.ok) throw new Error('Erreur envoi OTP');
      return res.json();
    },
    onSuccess: (_, data) => {
      setPhoneNumber(data.phone);
      setStep(2);
    },
  });

  // Mutation : vérifier OTP
  const verifyOtpMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, otp: data.otp }),
      });
      if (!res.ok) throw new Error('OTP invalide');
      const result = await res.json();
      localStorage.setItem('token', result.token); // Stocker JWT
      return result;
    },
    onSuccess: () => {
      window.location.href = '/dashboard'; // Redirection post-login
    },
  });

  // Soumission
  const onSubmit = (data) => {
    if (step === 1) sendOtpMutation.mutate(data);
    else verifyOtpMutation.mutate(data);
  };

  return (
    <div className="auth-form">
      <h2>{step === 1 ? 'Connexion' : 'Code de vérification'}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 ? (
          <>
            <label>Numéro de téléphone</label>
            <input type="text" {...register('phone')} placeholder="07XXXXXXXX" />
            {errors.phone && <p className="error">{errors.phone.message}</p>}
          </>
        ) : (
          <>
            <label>Code OTP</label>
            <input type="text" {...register('otp')} placeholder="XXXXXX" />
            {errors.otp && <p className="error">{errors.otp.message}</p>}
          </>
        )}
        <button type="submit" disabled={sendOtpMutation.isLoading || verifyOtpMutation.isLoading}>
          {step === 1 ? 'Envoyer le code' : 'Vérifier'}
        </button>
      </form>
      {(sendOtpMutation.isError || verifyOtpMutation.isError) && (
        <p className="error">Erreur : {sendOtpMutation.error?.message || verifyOtpMutation.error?.message}</p>
      )}
    </div>
  );
};

export default AuthForm;
