import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Rocket, Mail, Lock, User, Eye, EyeOff, Zap } from 'lucide-react';
import { Button } from '@/Components/button';
import { Input } from '@/Components/input';
import { Checkbox } from '@/Components/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/Components/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/card';

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    referral_code: z
      .string()
      .optional()
      .refine(
        (val) => !val || (val.length === 6),
        { message: "Referral code must be exactly 6 characters" }
      ),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine(val => val === true, {
        message: "You must agree to the terms and conditions",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;


const Register = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: "",
          confirmPassword: "",
          referral_code: "",
          agreeToTerms: false,
        },
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            await axios.post('/register', data);

            toast({
                title: "Account created!",
                description: "Welcome aboard 👋",
            });

            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        } catch (error: any) {
            console.log('Register error:', error.response?.data?.message || error.message);
            if (error.response?.status === 422) {
                const serverErrors = error.response.data.errors;
                Object.keys(serverErrors).forEach((key) => {
                    form.setError(key as keyof FormData, {
                        type: "server",
                        message: serverErrors[key][0],
                    });
                });
            } else {
                toast({
                    title: "Registration failed",
                    description: "An unexpected error occurred.",
                    variant: "destructive",
                });
            }
        }finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Head title="Register" />
            <header className="absolute top-0 left-0 w-full flex justify-between items-center px-5 md:px-10 py-4 z-10 select-none">
                <div className="flex items-center">
                    <img src="/assets/images/Blazenode.svg" alt="Blazenode Logo" className="h-[60px] object-contain" />
                </div>
                <div className="hidden md:flex items-center space-x-4 gap-5">
                    <a href="https://x.com/your_twitter_handle" target="_blank" rel="noopener noreferrer">
                    <img src="/assets/images/twitter-x.svg" alt="Twitter (X)" className="h-6 hover:opacity-80 transition-opacity filter invert" />
                    </a>
                    <a href="https://discord.gg/your_invite_link" target="_blank" rel="noopener noreferrer">
                    <img src="/assets/images/discord.svg" alt="Discord" className="h-6 hover:opacity-80 transition-opacity filter invert" />
                    </a>
                </div>
            </header>
            <div className="min-h-screen bg-roller-background flex items-center justify-center p-4 md:p-8 select-none">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-roller-background"
                    style={{
                        backgroundImage: "radial-gradient(rgba(123, 97, 255, 0.15) 1px, transparent 0)",
                        backgroundSize: "25px 25px"
                    }}
                    />
                </div>

                <Card className="w-full max-w-md bg-roller-card-bg border border-roller-primary/30 shadow-xl shadow-roller-primary/20 relative overflow-hidden transform transition-all">
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-tr from-roller-primary via-roller-secondary to-roller-accent opacity-30 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-bl from-roller-accent via-roller-primary to-roller-secondary opacity-30 blur-3xl" />

                    <CardHeader className="space-y-2 text-center">
                    <div className="mx-auto w-20 h-20  flex items-center justify-center mb-2 shadow-lg">
                        <img src="/assets/images/logo.svg" className="w-full h-full object-contain" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Join Bladenode and start earning today.
                    </CardDescription>
                    </CardHeader>

                    <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white/90">Email</FormLabel>
                                <FormControl>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                    placeholder="your@email.com"
                                    className="pl-10 bg-roller-dark/60 border-roller-primary/30 focus:border-roller-primary"
                                    {...field}
                                    />
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white/90">Password</FormLabel>
                                <FormControl>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="pl-10 bg-roller-dark/60 border-roller-primary/30 focus:border-roller-primary"
                                    {...field}
                                    />
                                    <button
                                    type="button"
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-white transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                    >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white/90">Confirm Password</FormLabel>
                                <FormControl>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    className="pl-10 bg-roller-dark/60 border-roller-primary/30 focus:border-roller-primary"
                                    {...field}
                                    />
                                    <button
                                    type="button"
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-white transition-colors"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="referral_code"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white/90">Referral Code</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                        placeholder="ABC123"
                                        className="pl-10 bg-roller-dark/60 border-roller-primary/30 focus:border-roller-primary"
                                        {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="agreeToTerms"
                            render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                                <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-roller-primary data-[state=checked]:border-roller-primary"
                                />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm text-white/70">
                                    I agree to the{" "}
                                    <a href="#" className="text-roller-accent hover:text-roller-accent/80 transition-colors">
                                    terms of service
                                    </a>{" "}
                                    and{" "}
                                    <a href="#" className="text-roller-accent hover:text-roller-accent/80 transition-colors">
                                    privacy policy
                                    </a>
                                </FormLabel>
                                <FormMessage />
                                </div>
                            </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-roller-primary to-roller-secondary hover:opacity-90 transition-opacity py-6 mt-6 btn-3d"
                        >
                            Create Account
                        </Button>
                        </form>
                    </Form>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 pt-0">
                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                        href="/login"
                        className="text-roller-accent hover:text-roller-accent/80 font-medium transition-colors"
                        >
                        Sign in
                        </Link>
                    </div>
                    </CardFooter>
                </Card>
                </div>
        </>
    );
}

export default Register;
