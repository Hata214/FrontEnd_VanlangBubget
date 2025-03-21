'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import {
    BarChart3,
    BarChart4,
    Check,
    CheckCircle,
    Clock,
    Code,
    CreditCard,
    Fingerprint,
    LayoutDashboard,
    LineChart,
    Lock,
    PiggyBank,
    Shield,
    Star,
    TrendingUp,
    Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import PublicLayout from '@/components/layout/PublicLayout'

export default function HomePage() {
    const t = useTranslations()
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

    const features = [
        {
            icon: <BarChart3 className="h-8 w-8 text-primary" />,
            title: t('home.features.expenseTracking.title'),
            description: t('home.features.expenseTracking.description')
        },
        {
            icon: <PiggyBank className="h-8 w-8 text-primary" />,
            title: t('home.features.budgetManagement.title'),
            description: t('home.features.budgetManagement.description')
        },
        {
            icon: <LineChart className="h-8 w-8 text-primary" />,
            title: t('home.features.financialAnalysis.title'),
            description: t('home.features.financialAnalysis.description')
        },
        {
            icon: <Clock className="h-8 w-8 text-primary" />,
            title: t('home.features.futurePlanning.title'),
            description: t('home.features.futurePlanning.description')
        },
        {
            icon: <CreditCard className="h-8 w-8 text-primary" />,
            title: t('home.features.loanManagement.title'),
            description: t('home.features.loanManagement.description')
        },
        {
            icon: <Shield className="h-8 w-8 text-primary" />,
            title: t('home.features.dataSecurity.title'),
            description: t('home.features.dataSecurity.description')
        }
    ];

    const testimonials = [
        {
            content: "",
            author: "",
            role: ""
        },
        {
            content: "",
            author: "",
            role: ""
        },
        {
            content: "",
            author: "",
            role: ""
        }
    ];

    const faqs: { question: string; answer: string }[] = t.raw('home.faq.questions') as { question: string; answer: string }[];

    interface PricingPlan {
        name: string;
        price: string;
        description: string;
        features: string[];
    }

    const pricingPlans: PricingPlan[] = [
        {
            name: t('home.pricing.basic.title'),
            price: t('home.pricing.basic.price'),
            description: t('home.pricing.basic.description'),
            features: t.raw('home.pricing.basic.features') as string[]
        },
        {
            name: t('home.pricing.premium.title'),
            price: t('home.pricing.premium.price'),
            description: t('home.pricing.premium.description'),
            features: t.raw('home.pricing.premium.features') as string[]
        }
    ];

    return (
        <PublicLayout>
            <div className="relative isolate">
                {/* Hero */}
                <div className="bg-background">
                    <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
                        <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                            <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                                    {t('home.hero.title')}
                                </h1>
                                <p className="relative mt-6 text-lg leading-8 text-muted-foreground sm:max-w-md lg:max-w-none">
                                    {t('home.hero.description')}
                                </p>
                                <div className="mt-10 flex items-center gap-x-6">
                                    <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                                        <Button size="lg">{t('home.hero.getStarted')}</Button>
                                    </Link>
                                    <Link
                                        href="/features"
                                        className="text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400"
                                    >
                                        {t('home.hero.learnMore')} <span aria-hidden="true">→</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                                {/* ... existing images ... */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <section className="bg-primary">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <p className="text-4xl md:text-5xl font-bold text-primary-foreground">--</p>
                                <p className="mt-2 text-lg text-primary-foreground/80">{t('home.stats.monthlyUsers')}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl md:text-5xl font-bold text-primary-foreground">--</p>
                                <p className="mt-2 text-lg text-primary-foreground/80">{t('home.stats.transactionsManaged')}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl md:text-5xl font-bold text-primary-foreground">--</p>
                                <p className="mt-2 text-lg text-primary-foreground/80">{t('home.stats.savingsIncrease')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 md:py-24 bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                {t('home.features.title')}
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                {t('home.features.subtitle')}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="p-6 bg-card rounded-lg shadow-md border border-border hover:shadow-lg transition-shadow duration-300">
                                    <div className="mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* App Screenshots Section */}
                <section className="bg-background py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                {t('home.screenshots.title')}
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                {t('home.screenshots.subtitle')}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-card p-2 rounded-xl shadow-md overflow-hidden border border-border">
                                <div className="aspect-video rounded-lg bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                                    <BarChart4 className="h-16 w-16 text-indigo-500" />
                                    <span className="ml-2 text-lg font-medium text-indigo-600 dark:text-indigo-400">{t('home.screenshots.financialOverview')}</span>
                                </div>
                            </div>
                            <div className="bg-card p-2 rounded-xl shadow-md overflow-hidden border border-border">
                                <div className="aspect-video rounded-lg bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                                    <TrendingUp className="h-16 w-16 text-green-500" />
                                    <span className="ml-2 text-lg font-medium text-green-600 dark:text-green-400">{t('home.screenshots.incomeAnalysis')}</span>
                                </div>
                            </div>
                            <div className="bg-card p-2 rounded-xl shadow-md overflow-hidden border border-border">
                                <div className="aspect-video rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                                    <CreditCard className="h-16 w-16 text-red-500" />
                                    <span className="ml-2 text-lg font-medium text-red-600 dark:text-red-400">{t('home.screenshots.expenseManagement')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-16 md:py-24 bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                {t('home.testimonials.title')}
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">

                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="bg-card p-8 rounded-lg shadow-md border border-border">
                                    <div className="flex mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-foreground mb-6">{testimonial.content ? `"${testimonial.content}"` : ""}</p>
                                    <div>
                                        <p className="font-semibold text-indigo-600 dark:text-indigo-400">{testimonial.author}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="bg-background py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                {t('home.pricing.title')}
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                {t('home.pricing.subtitle')}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {pricingPlans.map((plan, index) => (
                                <div key={index} className={`rounded-lg shadow-md overflow-hidden border ${index === 1 ? 'border-primary' : 'border-border'}`}>
                                    <div className={`p-6 ${index === 1 ? 'bg-primary' : 'bg-card dark:bg-slate-800'}`}>
                                        <h3 className={`text-xl font-bold ${index === 1 ? 'text-primary-foreground' : 'text-indigo-600 dark:text-indigo-400'}`}>{plan.name}</h3>
                                        <p className={`mt-2 ${index === 1 ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{plan.description}</p>
                                        <p className={`mt-4 text-3xl font-bold ${index === 1 ? 'text-primary-foreground' : 'text-foreground'}`}>{plan.price}</p>
                                    </div>
                                    <div className="p-6 bg-card">
                                        <ul className="space-y-4">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start">
                                                    <Check className={`h-5 w-5 mr-2 ${index === 1 ? 'text-primary' : 'text-indigo-600 dark:text-indigo-400'}`} />
                                                    <span className="text-foreground">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-8">
                                            <Link
                                                href={index === 0 ? (isAuthenticated ? "/dashboard" : "/register") : "#"}
                                                className={`block w-full py-3 px-4 rounded-md text-center font-medium ${index === 1
                                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-600'
                                                    }`}
                                            >
                                                {index === 0 ? t('home.pricing.basic.action') : t('home.pricing.premium.action')}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 md:py-24 bg-background">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                {t('home.faq.title')}
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                {t('home.faq.subtitle')}
                            </p>
                        </div>
                        <div className="space-y-8">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-card shadow-md rounded-lg p-6 border border-border">
                                    <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{faq.question}</h3>
                                    <p className="text-muted-foreground">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="bg-background py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                {t('home.cta.title')}
                            </h2>
                            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                                {t('home.cta.description')}
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">{t('home.cta.getStarted')}</Button>
                                </Link>
                                <Link
                                    href="/contact"
                                    className="text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400"
                                >
                                    {t('home.cta.contact')} <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
} 