import React, { useEffect, useState } from 'react';
import { Rocket, Mail, Lock, Eye, EyeOff, Wallet, ArrowRight, Loader2 } from 'lucide-react'
import { Head, Link, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Button } from '@/Components/button';
import { Input } from '@/Components/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Toaster } from "@/Components/toaster";
import { ethers } from 'ethers';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/Components/form';
import Modal from '@/Components/Modal'
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/card';

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});
type FormData = z.infer<typeof formSchema>;
interface FlashProps {
    status?: string;
}

const Login = () => {
    const { disconnect } = useDisconnect();
    const { signMessageAsync } = useSignMessage();
    const [showWalletModal, setShowWalletModal] = useState(false);
    const { address, isConnected } = useAccount();
    const openWalletModal = () => setShowWalletModal(true);
    const { connect, connectors } = useConnect();
    const [isLoading, setIsLoading] = useState(false);
    const closeWalletModal = () => setShowWalletModal(false);
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const { props } = usePage<{ flash: FlashProps }>();
    const status = props.flash?.status;
    useEffect(() => {
        if (status) {
            toast({
                title: "Success",
                description: status,
                duration: 5000,
                draggable: true,
                style: {
                    backgroundColor: "rgb(24,128,56)",
                    borderColor: "rgba(123, 97, 255, 0.3)",
                    color: "white",
                    borderRadius: "6px",
                    opacity: 0.9,
                },
            });
        }
    }, [status]);
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const handleSign = async () => {
        try {
            // if (!address) {
            //     toast({
            //         title: "Warning!",
            //         description: "Wallet address not found.",
            //     });
            //     return;
            // }

            setIsLoading(true);

            // const signedMessage = await signMessageAsync({
            //     message: "Welcome to BlazeNode Early Access! Please sign this message to verify your wallet",
            // });

            // if (!signedMessage) {
            //     toast({
            //         title: "Warning!",
            //         description: "Message signing failed.",
            //     });
            //     setIsLoading(false);
            //     return;
            // }
            const provider = new ethers.BrowserProvider(window.ethereum);
            const message = "Please sign this message to authenticate";
            const signer = await provider.getSigner();
            const signature = await signer.signMessage(message);
            const response = await axios.post('/web3/verify-signature', {
                headers: {
                    'Content-Type': 'application/json',
                },
                address: await signer.getAddress(),
                signedMessage: signature,
                message: message
            });
            // const response = await fetch('/api/web3/verify-signature', {
            //     method: 'POST',
            //     headers: {
            //     'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         address: await signer.getAddress(),
            //         signedMessage: signature,
            //         message: message
            //     })
            // });
            const token = response.data.token;

            if (token) {
                sessionStorage.setItem('auth_token', token);
                window.location.href = '/dashboard';

            } else {
                console.error('No token found in response');
            }

            if (response.status != 200) {
                throw new Error('Server verification failed.');
            }
            // const result = await response.json();

            // if (result.error) {
            //     toast({
            //         title: "Warning!",
            //         description: result.error,
            //     });
            //     setIsLoading(false);
            //     return;
            // }
            toast({
                title: "Success!",
                description: "Wallet verified successfully!",
            });
        // router.push('/app');
        } catch (error) {
        console.error('Something went wrong:', error);
        toast({
            title: "Error!",
            description: "Something went wrong during verification.",
        });
        } finally {
        setIsLoading(false);
        
            // disconnect();
        }
    };

    const handleDisconnect = async () => {
        setIsLoading(true);
        try {
            toast({
                title: "Success!",
                description: "Disconnected successfully!",
            });
            disconnect();
        } catch (err) {
        console.error('Error: ', err);
        toast({
                title: "Error!",
                description: "An error occurred while disconnecting!",
            });
        } finally {
        // router.push('/');
        setIsLoading(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
        //   const response = await axios.post(route('login'), data);
        await axios.get('/sanctum/csrf-cookie');
        const response = await axios.post('/login', data);
        const token = response.data.token;
        const user = response.data.user;

          if (token) {
            sessionStorage.setItem('auth_token', token);
            window.location.href = '/dashboard';

          } else {
            console.error('No token found in response');
          }
        } catch (error: any) {
          console.error('Login failed:', error.response?.data?.message || error.message);
        }
    };

    const getWalletIcon = (name: string) => {
        switch (name.toLowerCase()) {
        case 'metamask':
        case 'injected':
            return (
            <div className=" bg-orange-500/20 p-2 rounded-md">
                <img src="/assets/wallets/metamask.webp" className="h-5 w-5 text-orange-500" />
            </div>
            );
        case 'coinbase wallet':
            return (
            <div className="bg-blue-500/20 p-2 rounded-md">
                <img src="/assets/wallets/coinbase.png" className="h-5 w-5 text-blue-500" />
            </div>
            );
        case 'walletconnect':
            return (
            <div className="bg-purple-500/20 p-2 rounded-md">
                <img src="/assets/wallets/walletconnect.png" className="h-5 w-5 text-purple-500" />
            </div>
            );
        case 'okx wallet':
            return (
            <div className="bg-white p-2 rounded-md">
                <img src="/assets/wallets/okx.png" className="h-5 w-5 text-white" />
            </div>
            );
        case 'bitget wallet':
            return (
            <div className="bg-blue-500/20 p-2 rounded-md">
                <img src="/assets/wallets/bitget.webp" className="h-5 w-5 text-white" />
            </div>
            );
        case 'brave wallet':
            return (
            <div className="bg-blue-500/20 p-2 rounded-md">
                <img src="/assets/wallets/brave.png" className="h-5 w-5 text-white" />
            </div>
            );
        default:
            return (
            <div className="bg-gray-500/20 p-2 rounded-md">
                <Wallet className="h-5 w-5 text-gray-500" />
            </div>
            );
        }
    };

    return (
      <>
        <Head title="Log in" />
        <Toaster />
        <header className="absolute top-0 left-0 w-full flex justify-between items-center px-5 md:px-10 py-4 z-10 select-none">
            <div className="flex items-center">
                <img src="/assets/images/logo.png" alt="Blazenode Logo" className="h-7 object-contain  mr-[1px]" />
                <span className="font-medium text-2xl">lazenode</span>
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

            <Card className="w-full max-w-md bg-roller-card-bg border  shadow-xl shadow-roller-primary/20 relative overflow-hidden transform transition-all">
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-tr from-roller-primary via-roller-secondary to-roller-accent opacity-30 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-bl from-roller-accent via-roller-primary to-roller-secondary opacity-30 blur-3xl" />

                <CardHeader className="space-y-2 text-center">
                <div className="mx-auto w-20 h-20  flex items-center justify-center mb-2 shadow-lg">
                    <img src="/assets/images/logo.png" className="w-full h-full object-contain" />
                </div>
                <CardTitle className="text-2xl font-bold text-white mt-0">Welcome Back</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Sign in to your Bladenode account
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

                    <div className="text-sm text-right">
                        <a
                        href="#"
                        className="text-roller-accent hover:text-roller-accent/80 transition-colors"
                        >
                        Forgot password?
                        </a>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blaze-loginDark hover:opacity-90 transition-opacity py-6 btn-3d"
                    >
                        Sign In
                    </Button>
                    </form>
                </Form>
                </CardContent>

                <CardFooter className="flex flex-col space-y-2 pt-0">
                <div className="relative w-full flex items-center gap-2 my-2">
                    <div className="flex-1 h-px bg-border"></div>
                    <span className="text-xs text-muted-foreground">OR</span>
                    <div className="flex-1 h-px bg-border"></div>
                </div>
                <button
                    onClick={openWalletModal}
                    type="button"
                    className="mt-0 w-full bg-gradient-to-r from-blaze-primary to-blaze-secondary hover:opacity-90 transition-opacity py-3 rounded-sm">
                    Connect your wallet
                </button>
                <Modal show={showWalletModal} onClose={closeWalletModal} maxWidth="sm">
                    <div className="p-6 min-h-[305px] mx-auto">
                        <div className="mx-auto w-10 h-10  flex items-center justify-center mb-2 shadow-lg">
                            <img src="/assets/images/logo.png" className="w-full h-full object-contain" />
                        </div>
                        {!isConnected ? (
                            <div>
                                <h2 className="text-lg font-semibold text-white text-center mb-4">
                                    Connect with your wallet
                                </h2>
                        
                                {connectors
                                    .filter((connector) => {
                                    if (connector.id === 'injected') return false;
                                    return true;
                                    })
                                    .map((connector) => (
                                    <button
                                        key={connector.id}
                                        onClick={() => connect({ connector })}
                                        className="w-full px-4 py-3 bg-[#282828] hover:bg-[#2D3B56] 
                                        border border-[#2D3B56]/70 rounded-xl text-white 
                                        font-medium flex items-center justify-between
                                        transition-all duration-200 group my-2"
                                        >
                                        <div className="flex items-center gap-3">
                                            {getWalletIcon(connector.name)}
                                            <span className="text-white">{connector.name}</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                                <div className="my-5 flex items-center">
                                    <hr className="flex-grow border-gray-600" />
                                    <span className="mx-4 text-gray-200 text-sm whitespace-nowrap">Or create an Account</span>
                                    <hr className="flex-grow border-gray-600" />
                                </div>
                                <Link
                                    href="/register"
                                    className={`bg-gradient-to-r from-blaze-primary to-blaze-secondary hover:opacity-90 transition-opacity group w-full flex h-min items-center hover:text-gray-200 text-gray-100 justify-center ring-none rounded-lg shadow-lg font-semibold py-2 px-4 font-dm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 border-b-red-900 disabled:border-0 ring-white border-b-4 active:bg-gray-200 focus-visible:outline-gray-500 text-sm sm:text-base dark:bg-gray-700 dark:border-gray-700 dark:border-b-gray-900 mt-3`}
                                >
                                    Continue with email
                                </Link>
                            </div>
                            ) : (
                                <div className="text-center space-y-2">
                                <h2 className="text-lg font-semibold text-white">
                                    Verify Your Wallet
                                </h2>
                                <p className="text-gray-400">
                                    Please sign the message to verify your wallet
                                </p>

                                <div className="mt-2 py-2 px-4 bg-[#1E2A45]/70 rounded-lg inline-flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-gray-300 font-medium">
                                    Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                                    </span>
                                </div>
                            <button
                                onClick={handleSign}
                                className={`group w-full flex h-min items-center hover:text-gray-500 text-gray-700 justify-center ring-none rounded-lg shadow-lg font-semibold py-2 px-4 font-dm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-gray-300 border-b-gray-700 disabled:border-0 disabled:bg-gray-200 ring-white border-b-4 active:bg-gray-200 focus-visible:outline-gray-500 text-sm sm:text-base dark:bg-gray-700 dark:border-gray-700 dark:border-b-gray-900" ${
                                    isLoading
                                    ? 'bg-gray-600/50 text-gray-300 cursor-not-allowed border border-gray-700/30'
                                    : 'hover:bg-gray-200 border border-[#3B82F6]/30'
                                }`}
                            >
                            {isLoading ? (
                                <>
                                <Loader2 className="animate-spin h-5 w-5" />
                                <span>Verifying...</span>
                                </>
                            ) : (
                                <>Sign Message</>
                            )}
                            </button>
                            <button
                                onClick={handleDisconnect}
                                className={`group w-full flex h-min items-center disabled:opacity-50 disabled:hover:opacity-50 hover:opacity-95 justify-center ring-none rounded-lg shadow-lg font-semibold py-2 px-4 font-dm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-red-500 border-b-red-700 disabled:border-0 disabled:bg-red-500 disabled:text-white ring-white text-white border-b-4 hover:text-gray-100 active:bg-red-800 active:text-gray-300 focus-visible:outline-red-500 text-sm sm:text-base dark:bg-gray-700 dark:border-gray-700 dark:border-b-gray-900" ${
                                    isLoading
                                    ? 'bg-gray-600/50 text-gray-300 cursor-not-allowed border border-gray-700/30'
                                    : ' hover:bg-red-800 text-white border border-[#3B82F6]/30'
                                }`}
                            >
                            {isLoading ? (
                                <>
                                <Loader2 className="animate-spin h-5 w-5" />
                                <span>Disconnecting...</span>
                                </>
                            ) : (
                                <span>Disconnect Wallet</span>
                            )}
                            </button>
                            </div>
                            )}
                            
                    </div>
                </Modal>

                <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                    href="/register"
                    className="text-roller-accent hover:text-roller-accent/80 font-medium transition-colors"
                    >
                    Sign up
                    </Link>
                </div>
                </CardFooter>
            </Card>
        </div>
        <div className=" absolute top-[800px] left-[0] right-[0] flex md:hidden justify-center  gap-6">
            <a href="https://x.com/yourhandle" target="_blank" rel="noopener noreferrer">
                <img
                src="/assets/images/twitter-x.svg"
                alt="Twitter"
                className="h-6 w-6 filter invert transition-opacity hover:opacity-80"
                />
            </a>
            <a href="https://discord.com/invite/yourinvite" target="_blank" rel="noopener noreferrer">
                <img
                src="/assets/images/discord.svg"
                alt="Discord"
                className="h-6 w-6 filter invert transition-opacity hover:opacity-80"
                />
            </a>
        </div>
      </>
    );
  };

  export default Login;
